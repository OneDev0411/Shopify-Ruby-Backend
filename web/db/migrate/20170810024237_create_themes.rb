class CreateThemes < ActiveRecord::Migration[5.2]
  def change
    create_table :themes do |t|
      t.string :name
      t.boolean :uses_ajax_cart
      t.string :custom_dom_action
      t.string :custom_dom_selector
      t.string :custom_ajax_dom_selector
      t.string :custom_ajax_dom_action
      t.string :settings_asset_file
      t.string :button_background_color_path
      t.string :text_color_path
      t.string :background_color_path
      t.string :button_text_color_path

      t.timestamps null: false
    end
  end
end
