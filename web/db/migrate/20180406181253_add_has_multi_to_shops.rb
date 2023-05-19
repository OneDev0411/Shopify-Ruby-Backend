class AddHasMultiToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :has_multi, :boolean
  end
end
