class CreateAdvancedPlacementSettings < ActiveRecord::Migration[7.0]
  def change
    create_table :advanced_placement_settings do |t|
      t.boolean :advanced_placement_setting_enabled
      t.string :custom_product_page_dom_selector
      t.string :custom_product_page_dom_action
      t.string :custom_cart_page_dom_selector
      t.string :custom_cart_page_dom_action
      t.string :custom_ajax_dom_selector
      t.string :custom_ajax_dom_action
      t.references :offer, foreign_key: true

      t.timestamps
    end
  end
end
