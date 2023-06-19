class AddFetchedShopifyOrdersAtToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :fetched_shopify_orders_at, :datetime
  end
end
