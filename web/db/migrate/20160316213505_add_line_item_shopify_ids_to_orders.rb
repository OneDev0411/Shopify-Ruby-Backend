class AddLineItemShopifyIdsToOrders < ActiveRecord::Migration[5.2]
  def change
    add_column :orders, :line_item_product_shopify_ids, :jsonb
  end
end
