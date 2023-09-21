class CreatePlacementSettings < ActiveRecord::Migration[7.0]
  def change
    create_table :placement_settings do |t|
      t.boolean :default_ajax_cart
      t.boolean :default_product_page
      t.boolean :default_cart_page
      t.integer :template_ajax_id
      t.integer :template_product_id
      t.integer :template_cart_id

      t.references :offer, foreign_key: true

      t.timestamps
    end
  end
end
