desc "Count Daily Orders having Products from the Offers"
task :count_daily_orders_having_offer_products => :environment do
  Shop.includes(:offers).includes(:orders).where.not(shopify_token: [nil, '']).where(uninstalled_at: nil).find_in_batches(batch_size: 200) do |shops|
    count = 0
    shops.each do |shop|
      shop.offers.active.each do |offer|
        count += shop.orders.where('CAST(product_shopify_ids AS BIGINT[]) &&  ARRAY[?] and created_at >= ?', offer.offerable_product_shopify_ids, Date.today).count
      end
      shop.update_attribute(:orders_through_offers, shop.orders_through_offers+count)
    end
  end
end
