class AddSyncStateToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :last_synced_at, :datetime
    add_column :products, :sync_state, :string
    add_column :products, :sync_job_id, :bigint
    add_column :products, :next_sync_at, :datetime
  end
end
