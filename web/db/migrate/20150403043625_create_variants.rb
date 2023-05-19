class CreateVariants < ActiveRecord::Migration[5.2]
  def change
    create_table :variants do |t|
      t.references :product, index: true
      t.string :title
      t.string :image_url
      t.integer :shopify_id
      t.datetime :shopify_updated_at

      t.timestamps null: false
    end
    add_foreign_key :variants, :products
  end
end
