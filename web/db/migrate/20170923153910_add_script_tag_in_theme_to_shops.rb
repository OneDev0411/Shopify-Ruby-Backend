class AddScriptTagInThemeToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :script_tag_location, :string, null: false, default: 'asyncload'
  end
end
