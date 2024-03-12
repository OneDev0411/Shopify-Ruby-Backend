class AddThemeVersionToShops < ActiveRecord::Migration[7.0]
  def change
    add_column :shops, :theme_version, :string
  end
end
