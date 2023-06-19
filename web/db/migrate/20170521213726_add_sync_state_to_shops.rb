class AddSyncStateToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :sync_state, :string
  end
end
