class CreateThemeSettingForTemplates < ActiveRecord::Migration[7.0]
  def change
    create_table :theme_setting_for_templates do |t|
      t.string :theme_name
      t.string :page_type
      t.integer :position
      t.string :action
      t.string :selector
      t.string :image_url

      t.timestamps
    end
  end
end
