class AddArrayToOrders < ActiveRecord::Migration[5.2]
  def change
    add_column :orders, :product_shopify_ids, :text, array: true
  end
end
