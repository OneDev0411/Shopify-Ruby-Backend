class AddToggleableCssToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :css_fields, :jsonb
  end
end
