module ShopWorker

  class ForcePurgeCacheJob
    include Sidekiq::Worker
    include Sidekiq::Status::Worker
    sidekiq_options queue: 'shop', retry: 2
    def perform(shop_id)
      icushop = Shop.find_by(id: shop_id)
      return if icushop.blank?
      icushop.force_purge_cache
    end
  end

  class SaveOfferStatJob
    include Sidekiq::Worker
    sidekiq_options queue: 'stats'

    
    def perform(new_stat)
      offer = Offer.find_by(new_event[:offerId])
      return if !offer.shop.is_shop_active
      OfferStat.create_offer_stat(new_stat)
    end
  end

  class SaveOfferEventJob
    include Sidekiq::Worker
    sidekiq_options queue: 'stats'

    def perform(new_event)
      offer = Offer.find_by(new_event[:offerId])
      return if !offer.shop.is_shop_active
      OfferEvent.create_offer_event(new_event)
    end
  end

  class SaveOfferSaleJob
    include Sidekiq::Worker
    sidekiq_options queue: 'sale_stats'

    def perform(order_data)
      OfferEvent.create_offer_sale_stat(order_data)
    end
  end

  class CheckOfferableStatusJob
    include Sidekiq::Worker
    def perform(shop_id)
      icushop = Shop.find_by(id: shop_id)
      return if icushop.blank?
      icushop.check_offerable_inventory
      PendingJob.find_by(shop_id: shop_id, sidekiq_id: self.jid).try(:destroy)
      rescue ShopifyAPI::Errors::NoActiveSessionError => e
        PendingJob.find_by(shop_id: shop_id, sidekiq_id: self.jid).try(:destroy)
    end
  end

  class RefreshSalesIntelligenceJob
    include Sidekiq::Worker
    def perform(shop_id)
      icushop = Shop.find_by(id: shop_id)
      return if icushop.blank?
      icushop.fetch_data_on_companions
      PendingJob.find_by(shop_id: shop_id, sidekiq_id: self.jid).try(:destroy)
    end
  end

  class EnableAutopilotJob
    include Sidekiq::Worker
    sidekiq_options queue: 'autopilot'
    
    def perform(shop_id)
      icushop = Shop.find_by(id: shop_id)
      return if icushop.blank?
      icushop.setup_autopilot_first_time(jid)
    end
  end

  class FetchOrdersJob
    include Sidekiq::Worker
    def perform(shop_id)
      icushop = Shop.find_by(id: shop_id)
      return if icushop.blank?
      icushop.fetch_shopify_orders
      PendingJob.find_by(shop_id: shop_id, sidekiq_id: self.jid).try(:destroy)
    end
  end

  class EnsureInCartUpsellWebhooksJob
    include Sidekiq::Worker
    def perform(shop_id)
      icushop = Shop.find_by(id: shop_id)
      return if icushop.blank?
      icushop.ensure_incartupsell_webhooks
      icushop.update_attribute(:script_tag_location, 'icu_webhooks')
    end
  end

  class DeleteInCartUpsellEventbridgeWebhooksJob
    include Sidekiq::Worker
    def perform(shop_id)
      icushop = Shop.find_by(id: shop_id)
      return if icushop.blank?
      icushop.delete_webhooks
    end
  end

  class CreateScriptTagJob
    include Sidekiq::Worker
    sidekiq_options queue: 'scripts'

    def perform(shop_id)
      icushop = Shop.find_by(id: shop_id)
      return if icushop.blank?
      icushop.create_script_tag if icushop.active? && icushop.shopify_token.present?
    end
  end

  class UpdateOffersIfNeededJob
    include Sidekiq::Worker
    def perform(subscription_id)
      subscription = Subscription.find_by(id: subscription_id)
      return if subscription.blank? || !subscription.shop.is_shop_active
      subscription.update_offers_if_needed
    end
  end

  class UpdateCollectionJob
    include Sidekiq::Worker
    def perform(id)
      collection = Collection.find_by(id: id)
      return if collection.blank?
      collection.update_from_shopify_new
    end
  end

  class UpdateProductJob
    include Sidekiq::Worker
    def perform(id)
      product = Product.find_by(id: id)
      return if product.blank? || !product.shop.is_shop_active
      product.update_from_shopify_new
    end
  end

  class UpdateProductIfUsedInOfferJob
    include Sidekiq::Worker
    sidekiq_options queue: 'low'

    def perform(shopify_domain, shopify_id)
      shop = Shop.find_by(shopify_domain: shopify_domain)
      return if shop.blank?

      return false unless shop.uses_product_in_offer?(shopify_id)

      begin
        product = Product.find_or_create_by(shop_id: shop.id, shopify_id: shopify_id)
      rescue ActiveRecord::RecordNotUnique
        product = Product.find_by(shop_id: shop.id, shopify_id: shopify_id)
      end
      if product.present?
        product.update_from_shopify_new
      else
        Rollbar.error "Could not find OR create product #{shopify_id}"
      end
    end
  end

  class UpdateCollectionIfUsedInOfferJob
    include Sidekiq::Worker
    sidekiq_options queue: 'low'

    def perform(shopify_domain, shopify_id)
      icushop = Shop.find_by(shopify_domain: shopify_domain)
      return if icushop.blank?

      if icushop.uses_collection_in_offer?(shopify_id)
        collection = Collection.find_or_create_by(shop_id: icushop.id, shopify_id: shopify_id)
        collection.update_from_shopify_new
      end
    end
  end

  class MarkProductDeletedJob
    include Sidekiq::Worker
    sidekiq_options queue: 'low'

    def perform(shopify_domain, shopify_id)
      shop = Shop.find_by(shopify_domain: shopify_domain)
      return if shop.blank?
      product = Product.find_by(shop_id: shop.id, shopify_id: shopify_id)
      if product.present?
        product.published_status = "deleted"

        shop.offers.each do | offer |
          if offer.offerable_product_shopify_ids.include?(shopify_id)
            offer.offerable_product_shopify_ids.delete(shopify_id)
            offer.save
          end
        end

        product.save
      end
    end
  end

  class RecordOrderJob
    include Sidekiq::Worker
    sidekiq_options queue: 'orders'

    def perform(shopify_url, order_data)
      shop = Shop.find_by(shopify_domain: shopify_url)
      return if shop.blank?

      order = Order.find_or_create_by(shop_id: shop.id, shopify_id: order_data['shopify_id'])
      if order.present?
        order.line_item_product_shopify_ids = order_data['items']
        order.product_shopify_ids = order_data['items']
        order.unique_product_ids = order_data['items']&.uniq
        order.discount_code = order_data['discount_code']
        order.shopper_country = order_data['shopper_country']
        order.referring_site = order_data['referring_site']
        order.orders_count = order_data['orders_count']
        order.total = order_data['total']
        order.cart_token = order_data['cart_token']
        order.save
      end
    end
  end

  class MarkShopAsCancelledJob
    include Sidekiq::Worker
    def perform(shopify_domain)
      shop = Shop.find_by(shopify_domain: shopify_domain)
      return if shop.blank?

      shop.mark_as_cancelled
    end
  end

  class AddInitialChargeToSubscriptionJob
    include Sidekiq::Worker
    def perform(subscription_id)
      sub = Subscription.find_by(id: subscription_id)
      return if sub.blank?
      return if sub.plan.try(:id) != 19

      ShopAction.create(
        shop_id: sub.shop.id,
        action_timestamp: Time.now.utc.to_i,
        shopify_domain: sub.shop.shopify_domain,
        action: 'add_initial_charge_to_subscription',
        source: 'icu-redesign_add_initial_charge_to_subscription_job'
      )

      if sub.usage_charges.empty?
        charge = sub.calculate_monthly_usage_charge
        res = sub.add_usage_charge_to_shopify_bill(charge[:amount], charge[:description])
        if res.result == "success"
          sub.update(bill_on: bill_date + 30.days)
        else
          sub.update(bill_on: 1.day.from_now.to_date)
        end
      else
        trial_days = Subscription.get_time_period(ENV['TRIAL_PERIOD'].to_i, 30).days
        new_date   = sub.usage_charges.last.created_at.to_date + trial_days
        sub.update_column(:bill_on, new_date)
      end
    end
  end

  class UpdateShopJob
    include Sidekiq::Worker
    def perform(shopify_domain, payload)
      shop = Shop.find_by(shopify_domain: shopify_domain)
      return if shop.blank?

      should_republish = false
      if payload['timezone'] != shop.timezone || payload['custom_domain'] != shop.custom_domain || payload['money_format'] != shop.money_format
        should_republish = true
      end
      shop.name = payload['name']
      shop.shopify_id = payload['shopify_id']
      shop.email = payload['email']
      shop.timezone = payload['timezone']
      shop.iana_timezone = payload['iana_timezone']
      shop.money_format = payload['money_format']
      if payload['shopify_plan_name'] != shop.shopify_plan_name
        $customerio.identify(id: shop.id, email: shop.email, shopify_plan: payload['shopify_plan_name'], app_plan_name: shop.plan&.name, active: shop.active?, created_at: shop.created_at.to_i, updated_at: Time.now.to_i, status: "installed")
        ShopEvent.create(shop_id: shop.id, title: "Shopify Plan Changed", body: "From #{shop.shopify_plan_name} (#{shop.shopify_plan_internal_name}) to #{payload['shopify_plan_name']} (#{payload['shopify_plan_internal_name']})", revenue_impact: 0)
        if shop.shopify_plan_name == "frozen"
          should_republish = true
        end
      end
      shop.shopify_plan_name = payload['shopify_plan_name']
      shop.shopify_plan_internal_name = payload['shopify_plan_internal_name']
      shop.custom_domain = payload['custom_domain']
      shop.opened_at = payload['opened_at']
      shop.save
      shop.force_purge_cache if should_republish
      shop.fetch_shopify_settings # we are duplicating efforts and code here
    end
  end

  class ForcePurgeCacheForRakeJob
    include Sidekiq::Worker
    sidekiq_options queue: 'shop'
    def perform(shop_id)
      shop = Shop.find_by(id: shop_id)
      return if shop.blank?
      shop.activate_session
      shop.create_script_tag
      shop.force_purge_cache
    end
  end

  class ThemeUpdateJob
    include Sidekiq::Worker
    sidekiq_options queue: 'low'

    def perform(shopify_domain)
      shop = Shop.find_by(shopify_domain: shopify_domain)
      return if shop.blank?

      if shop.theme_app_extension.nil?
        shop.theme_app_extension = ThemeAppExtension.new
      end

      keys = shop.check_offers_placement
      keys_without_ajax = keys.map(&:clone)
      blocks_added = 0

      shop.check_app_embed_enabled
      keys_without_ajax.pop if keys.include?('ajax')

      shop.update_theme_version(keys_without_ajax)

      if keys_without_ajax.length.positive?
        keys_without_ajax.each do |key|
          next blocks_added unless (key == 'templates/product.json' && shop.theme_app_extension.product_block_added) ||
            (key == 'templates/cart.json' && shop.theme_app_extension.cart_block_added) ||
            (key == 'templates/collection.json' && shop.theme_app_extension.collection_block_added)

          blocks_added += 1
        end
      end

      unless (!shop.theme_app_extension&.theme_app_complete && ((blocks_added == keys_without_ajax.length) &&
        ((keys.include?('ajax') && shop.theme_app_embed) || keys.exclude?('ajax')))) && shop.offers.present?
        shop.theme_app_extension.update(theme_app_complete: true)

        unless shop.script_tag_id.nil?
          shop.disable_javascript
        end
      end
    end
  end
end
