class ValidateCreateThemeAppExtension < ActiveRecord::Migration[7.0]
  def change
    validate_foreign_key :theme_app_extensions, :shops
  end
end
