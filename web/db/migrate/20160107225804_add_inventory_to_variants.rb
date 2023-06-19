class AddInventoryToVariants < ActiveRecord::Migration[5.2]
  def change
    add_column :variants, :inventory_quantity, :integer
    add_column :variants, :inventory_policy, :string
    add_column :variants, :position, :integer
  end
end
