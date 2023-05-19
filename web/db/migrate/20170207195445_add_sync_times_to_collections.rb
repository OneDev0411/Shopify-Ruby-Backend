class AddSyncTimesToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :sync_times, :jsonb
  end
end
