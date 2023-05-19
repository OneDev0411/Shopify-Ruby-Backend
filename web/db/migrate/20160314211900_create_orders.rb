class CreateOrders < ActiveRecord::Migration[5.2]
  def change
    create_table :orders do |t|
      t.references :shop, index: true
      t.bigint :shopify_id
      t.jsonb :merchant_data

      t.timestamps null: false
    end
    add_foreign_key :orders, :shops
  end
end
