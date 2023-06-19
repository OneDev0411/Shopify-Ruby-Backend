class AddStatSyncToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :stats_synced_at, :datetime
  end
end
