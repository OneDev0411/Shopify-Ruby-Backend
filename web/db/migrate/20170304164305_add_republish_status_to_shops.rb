class AddRepublishStatusToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :republish_status, :string
  end
end
