class AddMultiLayoutToShops < ActiveRecord::Migration[7.0]
  def change
    add_column :shops, :multi_layout, :string
  end
end
