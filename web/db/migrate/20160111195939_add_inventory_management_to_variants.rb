class AddInventoryManagementToVariants < ActiveRecord::Migration[5.2]
  def change
    add_column :variants, :inventory_management, :string
  end
end
