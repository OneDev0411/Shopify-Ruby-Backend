class AddSkipInventoryToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :skip_inventory, :boolean
  end
end
