class CreateThemeAppExtension < ActiveRecord::Migration[7.0]
  def change
    create_table :theme_app_extensions do |t|
      t.references :shop, index: true
      t.boolean :product_block_added, default: false
      t.boolean :cart_block_added, default: false
      t.boolean :collection_block_added, default: false
      t.boolean :theme_app_embed, default: false
      t.boolean :theme_app_complete, default: false

      t.timestamps null: false
    end
    add_foreign_key :theme_app_extensions, :shops, validate: false
  end
end
