class AddIndexToShopifyCollectIds < ActiveRecord::Migration[5.2]
  def change
    add_index :collections, :shopify_id
    add_index :collects, :shopify_id
  end
end
