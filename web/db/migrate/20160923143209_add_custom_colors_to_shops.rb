class AddCustomColorsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :custom_bg_color, :string
    add_column :shops, :custom_text_color, :string
    add_column :shops, :custom_button_bg_color, :string
    add_column :shops, :custom_button_text_color, :string
  end
end
