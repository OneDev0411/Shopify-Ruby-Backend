class AddSyncingToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :syncing, :boolean, null:false, default: false
  end
end
