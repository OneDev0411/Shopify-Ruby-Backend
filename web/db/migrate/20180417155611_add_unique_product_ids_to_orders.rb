class AddUniqueProductIdsToOrders < ActiveRecord::Migration[5.2]
  def change
    add_column :orders, :unique_product_ids, :jsonb
  end
end
