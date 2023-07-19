class AddDefaultTemplateSettingsToShop < ActiveRecord::Migration[7.0]
  def change
     add_column :shops, :default_template_settings, :jsonb
  end
end
