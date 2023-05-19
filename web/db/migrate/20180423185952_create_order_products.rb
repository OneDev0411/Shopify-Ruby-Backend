class CreateOrderProducts < ActiveRecord::Migration[5.2]
  def change
    create_table :order_products do |t|
      t.references :order, index: true
      t.bigint :shopify_product_id, index: true

      # t.timestamps null: false
    end

  end
end
