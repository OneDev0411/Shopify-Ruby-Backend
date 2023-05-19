class CreateProductCompanions < ActiveRecord::Migration[5.2]
  def change
    create_table :product_companions do |t|
      t.bigint :product_shopify_id, index: true
      t.bigint :companion_product_shopify_id, index: true
      t.integer :orders, array: true, limit: 8
      t.integer :orders_count
    end
  end
end
