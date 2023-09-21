class CreateThemeDefaultSettings < ActiveRecord::Migration[7.0]
  def change
    create_table :theme_default_settings do |t|
      t.string :theme_name
      t.string :page_type
      t.string :selector
      t.string :action

      t.timestamps
    end
  end
end
