class AddLastSyncedAtToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :last_synced_at, :datetime
    add_column :collections, :needs_sync, :boolean
  end
end
