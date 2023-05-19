class AddMissingItemsToSyncResults < ActiveRecord::Migration[5.2]
  def change
    add_column :sync_results, :missing_products, :jsonb
    add_column :sync_results, :missing_collections, :jsonb
  end
end
