class AddSyncTimeToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :sync_times, :jsonb
  end
end
