class AddThemeNamesToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :shopify_theme_name, :string
    add_column :shops, :shopify_mobile_theme_name, :string
  end
end
