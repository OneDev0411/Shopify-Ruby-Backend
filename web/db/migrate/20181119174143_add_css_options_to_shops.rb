class AddCssOptionsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :css_options, :jsonb
  end
end
