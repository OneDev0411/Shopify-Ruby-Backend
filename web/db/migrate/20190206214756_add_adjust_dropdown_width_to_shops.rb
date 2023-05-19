class AddAdjustDropdownWidthToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :adjust_dropdown_width, :boolean, nil: false, default: true
  end
end
