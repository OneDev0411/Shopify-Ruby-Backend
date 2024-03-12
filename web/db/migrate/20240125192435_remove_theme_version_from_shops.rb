class RemoveThemeVersionFromShops < ActiveRecord::Migration[7.0]
  def change
    remove_column :shops, :theme_version, :string
  end
end
