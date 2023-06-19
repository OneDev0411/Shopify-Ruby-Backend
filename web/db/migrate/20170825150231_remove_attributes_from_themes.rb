class RemoveAttributesFromThemes < ActiveRecord::Migration[5.2]
  def up
    remove_column :themes, :uses_ajax_cart
    remove_column :themes, :custom_dom_action
    remove_column :themes, :custom_dom_selector
    remove_column :themes, :custom_ajax_dom_selector
    remove_column :themes, :custom_ajax_dom_action
    remove_column :themes, :button_background_color_path
    remove_column :themes, :text_color_path
    remove_column :themes, :background_color_path
    remove_column :themes, :button_text_color_path
  end

  def down
    add_column :themes, :uses_ajax_cart, :string
    add_column :themes, :custom_dom_action, :string
    add_column :themes, :custom_dom_selector, :string
    add_column :themes, :custom_ajax_dom_selector, :string
    add_column :themes, :custom_ajax_dom_action, :string
    add_column :themes, :button_background_color_path, :string
    add_column :themes, :text_color_path, :string
    add_column :themes, :background_color_path, :string
    add_column :themes, :button_text_color_path, :string
  end
end
