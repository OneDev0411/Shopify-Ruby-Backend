class CreateDiscountShops < ActiveRecord::Migration[6.1]
  def change
    create_table :discount_shops do |t|
      t.references :marketing, index: true
      t.references :shop, index: true

      t.timestamps
    end
    add_index :discount_shops, [:marketing_id, :shop_id], unique: true
  end
end
