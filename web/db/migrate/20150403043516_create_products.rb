class CreateProducts < ActiveRecord::Migration[5.2]
  def change
    create_table :products do |t|
      t.references :shop, index: true
      t.string :title
      t.integer :shopify_id
      t.string :product_type
      t.datetime :shopify_updated_at

      t.timestamps null: false
    end
    add_foreign_key :products, :shops
  end
end
