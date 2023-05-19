class AddUpdatedProductsToSyncResults < ActiveRecord::Migration[5.2]
  def change
    add_column :sync_results, :updated_products, :jsonb
    add_column :sync_results, :updated_collections, :jsonb
  end
end
