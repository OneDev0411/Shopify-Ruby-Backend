class AddSyncStatusToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :sync_state, :string
    add_column :collections, :published_status, :string
  end
end
