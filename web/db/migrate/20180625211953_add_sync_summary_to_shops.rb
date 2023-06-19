class AddSyncSummaryToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :last_refresh_result, :text
    add_column :shops, :last_refreshed_at, :datetime
  end
end
