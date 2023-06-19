class AddDefaultsToColors < ActiveRecord::Migration[5.2]
  def up
    change_column :shops, :custom_bg_color, :string, null: false, default: "#ECF0F1"
    change_column :shops, :custom_text_color, :string, null: false, default: "#2B3D51"
    change_column :shops, :custom_button_bg_color, :string, null: false, default: "#2B3D51"
    change_column :shops, :custom_button_text_color, :string, null: false, default: "#ffffff"
  end
  def down
    change_column :shops, :custom_bg_color, :string
    change_column :shops, :custom_text_color, :string
    change_column :shops, :custom_button_bg_color, :string
    change_column :shops, :custom_button_text_color, :string
  end

end
