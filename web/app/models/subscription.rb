# frozen_string_literal: true

# Each merchant has one subscription, and it describes things like what Plan they are
# on, the Shopify Charge ID of their RecurringApplicationCharge, and the status.
# Subscription has feature flags for things like has_ab_testing, has_branding, etc.
# If these are set, they override the values

class Subscription < ApplicationRecord
  include ActiveModel::Dirty
  include ActionView::Helpers::DateHelper
  belongs_to :plan
  belongs_to :shop, touch: true

  before_create :set_bill_on

  has_many :usage_charges
  after_save :async_update_offers_if_needed
  after_create :track_customerio_event
  before_update :track_plan_change, if: ->{ self.plan_id_changed? }
  before_save :mixpanel_track_plan_update


  scope :active_trial_shops, -> { where(status: 'approved', shopify_charge_id: nil) }
  scope :active_paying_shops, -> { where.not(shopify_charge_id: nil).where(status: 'approved') }

  def dollar_price
    price_in_cents / 100.0
  end

  def needs_confirmation?
    status != 'approved'
  end

  # Public. depending the Subscription type, sums available rules.
  #
  # Returns Array.
  def available_rule_types
    res = [
      ['Cart contains at least', 'cart_at_least'],
      ['Cart contains exactly', 'cart_exactly'],
      ['Cart contains at most', 'cart_at_most'],
      ['Cart does not contain', 'cart_does_not_contain'],
      ['Order Total Is At Least', 'total_at_least'],
      ['Order Total Is At Most', 'total_at_most'],
      ['Cookie is set', 'cookie_is_set'],
      ['Cookie is not set', 'cookie_is_not_set'],
      ['Customer is tagged', 'customer_is_tagged'],
      ['Customer is not tagged', 'customer_is_not_tagged']
    ]

    if shop.has_geo_offers
      res << ['Customer is located in', 'in_location']
      res << ['Customer is not located in', 'not_in_location']
    end
    if shop.has_recharge
      res << ['Cart contains ReCharge item #', 'cart_contains_recharge']
      res << ['Cart does not contain ReCharge item #', 'cart_does_not_contain_recharge']
    end
    res
  end

  # Public: Stablish the date for the next bill.
  #
  # Return boolean.
  def set_bill_on
    self.bill_on = Subscription.get_time_period(ENV["BILLING_PERIOD"].to_i, 30).days.from_now if bill_on.blank?
  end

  def self.usage_charge_schedule
    {
      trial_period_days: Subscription.get_time_period(ENV["TRIAL_PERIOD"].to_i, 30),
      base_price_dollars: 0.0,
      monthly_price: {
        'Shopify Plus' => 99.99,
        'Advanced Shopify' => 59.99,
        'Shopify' => 29.99,
        'Basic Shopify' => 19.99,
        'Development' => 0,
        'staff_business' => 0,
        'dormant' => 0,
        'cancelled' => 0,
        'custom' => 0,
        'affiliate' => 0,
        'NPO Full' => 0,
        'staff' => 0,
        'trial' => 0,
        'Shopify Alumni' => 0,
        'frozen' => 0,
        'Sales Training' => 0,
        'Developer Preview' => 0,
        'NPO Lite' => 0,
        'Shopify Plus Partner Sandbox' => 0,
        'Full Pause' => 0,
        'Pause and Build' => 0
      }
    }
  end

  def revenue_cents
    if plan.try(:internal_name) == 'plan_based_billing'
      if Subscription.usage_charge_schedule[:monthly_price][shop.shopify_plan_name].nil?
        Rollbar.error("No usage charge for plan #{shop.shopify_plan_name}")
        0
      else
        Subscription.usage_charge_schedule[:monthly_price][shop.shopify_plan_name] * 100
      end
    else
      price_in_cents
    end
  end

  def next_bill_amount
    Subscription.usage_charge_schedule[:monthly_price][shop.shopify_plan_name]
  end

  def calculate_monthly_usage_charge
    raise 'Shop has no Shopify plan' if shop.shopify_plan_name.blank?
    raise 'Does not use plan-based billing' unless plan.try(:internal_name) == 'plan_based_billing'

    bill_description = "#{shop.shopify_plan_name} plan"
    bill_amount = Subscription.usage_charge_schedule[:monthly_price][shop.shopify_plan_name] || 0
    if discount_percent.present? && discount_percent.positive?
      factor = (100 - discount_percent) / 100.0
      bill_amount = (bill_amount * factor).round(2)
      bill_description += " (#{discount_percent}% discount)"
    end
    {
      amount: bill_amount,
      description: bill_description
    }
  end

  def remove_recurring_charge
    return if shopify_charge_id.blank?

    shop.activate_session
    begin
      ShopifyAPI::RecurringApplicationCharge.delete(id: shopify_charge_id)
    rescue StandardError => e
      Rollbar.error('Error removing the recurringApplicationCharge >> ', e)
    end
    update shopify_charge_id: nil, status: 'approved'  # free plan
  end

  # public
  def create_recurring_charge(plan, icushop, confirm_subscription_url)
    price = if discount_percent.present? && discount_percent.positive?
              factor = (100 - discount_percent) / 100.0
              (plan.price_in_cents * factor / 100.0).round(2)
            else
              (plan.price_in_cents / 100.0).round(2)
            end
    test_mode = icushop.admin? || Rails.env.development?
    opts = {
      recurring_application_charge: {
        name: "In Cart Upsell - #{plan.name}",
        price: price,
        trial_days: days_remaining_in_trial,
        test: test_mode,
        return_url: confirm_subscription_url
      }
    }
    if plan.internal_name == 'plan_based_billing'
      opts[:recurring_application_charge][:capped_amount] = '99.99'
      opts[:recurring_application_charge][:terms] = 'Depending on your Shopify plan. Basic Shopify: $19.99/mo, ' \
                                                    'Shopify: $29.99/mo, Advanced Shopify: $59.99/mo, ' \
                                                    'Shopify Plus: $99.99/mo'
    end
    begin
      url = "https://#{icushop.shopify_domain}/admin/api/#{SHOPIFY_API_VERSION}/recurring_application_charges.json"
      res = HTTParty.post(url, body: opts.to_json, headers: icushop.api_headers)
      update shopify_charge_id: res['recurring_application_charge']['id'], status: 'pending_charge_approval'
      # res.get('recurring_application_charge.confirmation_url')
      res['recurring_application_charge']['confirmation_url']
    rescue StandardError => e
      Rollbar.error('Error new recurringApplicationCharge >> ', e)
      '/'
    end
  end

  # Public. Adds a usage charge of AMOUNT (a decimal number of dollars) to a store's shopify bill
  # with the description DESCRIPTION
  def add_usage_charge_to_shopify_bill(amount, description)
    url = "https://#{shop.shopify_domain}/admin/api/#{SHOPIFY_API_VERSION}/" \
          "recurring_application_charges/#{shopify_charge_id}/usage_charges.json"
    opts = {
      usage_charge: {
        description: description,
        price: amount
      }
    }
    usage_charge_opts = {
      subscription_id: self.id,
      amount_cents: (amount * 100.0).round,
      shopify_id: nil,
      result: nil
    }
    begin
      result = HTTParty.post(url, body: opts.to_json, headers: shop.api_headers)
      response = result.parsed_response
      if response.get('usage_charge.id').present?
        usage_charge_opts[:shopify_id] = response.get('usage_charge.id')
        usage_charge_opts[:result] = "success"
      elsif response.get('errors').present?
        # TODO: Check if the error is "we have the wrong subscription ID"
        # and update if necessary
        usage_charge_opts[:result] = response.get('errors').to_s
      else
        Rollbar.error('Unexpected UsageCharge result', result)
      end
    rescue Exception => e
      usage_charge_opts[:result] = e.message
      Rollbar.error('Unexpected UsageCharge exception', {message: e.message, shop_id: shop.id})
    end
    UsageCharge.create(usage_charge_opts)
  end

  #Fetch JSON object containing current usage charges
  def get_current_usage_charges
    url = "https://#{shop.shopify_domain}/admin/api/#{SHOPIFY_API_VERSION}/recurring_application_charges/"
    url << "#{shopify_charge_id}/usage_charges.json"
    res = HTTParty.get(url, headers: shop.api_headers)
  end

  # Public. pass through feature flags
  def offers_limit
    if read_attribute(:offers_limit).present?
      read_attribute(:offers_limit)
    else
      plan.present? && plan.offers_limit
    end
  end

  def views_limit
    if read_attribute(:views_limit).present?
      read_attribute(:views_limit)
    else
      plan.present? && plan.views_limit
    end
  end

  def price_in_cents
    if read_attribute(:price_in_cents).present?
      read_attribute(:price_in_cents)
    else
      if plan.present?
        plan.price_in_cents
      else
        0
      end
    end
  end

  def has_ajax_cart
    if read_attribute(:has_ajax_cart).present?
      read_attribute(:has_ajax_cart)
    else
      plan.present? && plan.has_ajax_cart
    end
  end

  def has_ab_testing
    if !read_attribute(:has_ab_testing).nil?
      read_attribute(:has_ab_testing)
    else
      plan.present? && plan.has_ab_testing
    end
  end

  def has_branding
    if !read_attribute(:has_branding).nil?
      read_attribute(:has_branding)
    else
      plan.present? && plan.has_branding
    end
  end

  def in_trial_period?
    days_remaining_in_trial.positive?
  end

  def days_remaining_in_trial
    seconds_remaining_in_trial = shop.created_at +  Subscription.get_time_period(ENV["TRIAL_PERIOD"].to_i, 30).days - Time.now
    if trial_ends_at.present?
      seconds_remaining_in_trial = trial_ends_at - Time.now
    end
    if seconds_remaining_in_trial.negative?
      0
    else
      (seconds_remaining_in_trial / 86400.0).ceil
    end
  end

  def shopify_status
    Rails.cache.fetch("subscription_status_#{id}", expires_in: 1.day) do
      begin
        shop.activate_session
        ShopifyAPI::RecurringApplicationCharge.find(id: shopify_charge_id)
      rescue
        nil
      end
    end
  end

  def async_update_offers_if_needed
    Sidekiq::Client.push('class' => 'ShopWorker::UpdateOffersIfNeededJob', 'args' => [id], 'queue' => 'default', 'at' => Time.now.to_i) if self.id.present?
    if self.id.blank?
      Rollbar.error("Cant update offers - id is blank: #{id}")
    end
  end

  def update_offers_if_needed
    needed = false
    shop.offers.each do |o|
      if o.show_powered_by != has_branding
        needed = true
        o.show_powered_by = has_branding
        o.save
      end
      if o.offerable_type == 'auto' && !shop.has_autopilot?
        o.active = false
        o.published_at = nil
        o.save
        needed = true
      end
    end
    shop.publish_async if needed
  end

  def self.get_time_period(time_period, default_time_period)
    if time_period > 0
      time_period
    else
      default_time_period
    end
  end

  def track_customerio_event
    # $customerio.track(shop.id, 'installed')
    # $customerio.identify(id: shop.id, email: shop.email, active: shop.active?, shopify_plan: shop.shopify_plan_name, app_plan_name: shop.plan&.name, created_at: shop.created_at.to_i, updated_at: shop.updated_at.to_i, status: "installed")
  end

  def track_plan_change
    previous_plan = Plan.find plan_id_was
    new_plan = Plan.find plan_id
    if previous_plan.name == "Free"
      # $customerio.track(shop.id, 'plan_changed')
      # $customerio.identify(id: shop.id, email: shop.email, active: shop.active?, shopify_plan: shop.shopify_plan_name, app_plan_name: new_plan&.name, created_at: shop.created_at.to_i, updated_at: shop.updated_at.to_i, status: "installed")
    end
  end

  def mixpanel_track_plan_update
    return if ENV['ENV']!="PRODUCTION"
    mixpanel=MixpanelEventsTracker.new
    if self.valid?
      mixpanel.track_plan_update_event(shop.shopify_id, 'Subscription Renewed', plan) and return if bill_on_changed? && status=="approved"
      
      mixpanel.track_plan_update_event(shop.shopify_id, 'Subscription Cancelled', plan) and return if status_changed? && status=="cancelled"
      
      if plan_id_changed? && !plan.flex_plan?
        mixpanel.track_plan_update_event(shop.shopify_id, 'Subscription Updated', plan) 
      elsif plan.internal_name == 'plan_based_billing' && status_changed? && status=="approved"
        mixpanel.track_plan_update_event(shop.shopify_id, 'Subscription Updated', plan)
      end
    end
  end

  def cancel_subscription
    self.status = "cancelled"
    self.save
  end

  def update_subscription(plan)
    update_attribute(:offers_limit, plan.offers_limit)
    update_attribute(:views_limit, plan.views_limit)
  end
end
