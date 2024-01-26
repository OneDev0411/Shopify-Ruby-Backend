class AddThemeVersionToThemeAppExtension < ActiveRecord::Migration[7.0]
  def change
    add_column :theme_app_extensions, :theme_version, :string
  end
end
