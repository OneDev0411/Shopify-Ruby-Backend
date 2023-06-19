class AddSyncToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :last_synced_at, :datetime
  end
end
