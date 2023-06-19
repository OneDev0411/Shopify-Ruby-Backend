class CreateCartTypes < ActiveRecord::Migration[5.2]
  def change
    create_table :cart_types do |t|
      t.references :theme, index: true
      t.string :name
      t.string :button_background_color_path
      t.string :text_color_path
      t.string :background_color_path
      t.string :button_text_color_path
      t.boolean :ajax
      t.text :refresh_code
      t.string :dom_selector
      t.string :dom_action
      t.text :css

      t.timestamps null: false
    end
    add_foreign_key :cart_types, :themes
  end
end
