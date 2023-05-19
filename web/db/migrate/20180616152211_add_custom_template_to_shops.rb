class AddCustomTemplateToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :custom_theme_template, :text
  end
end
