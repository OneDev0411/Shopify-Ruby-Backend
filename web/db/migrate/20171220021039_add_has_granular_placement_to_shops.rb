class AddHasGranularPlacementToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :has_granular_placement, :boolean
  end
end
