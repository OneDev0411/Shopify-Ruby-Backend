class AddSyncErrorsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :last_sync_error_code, :integer
    add_column :shops, :last_sync_error_at, :datetime
  end
end
