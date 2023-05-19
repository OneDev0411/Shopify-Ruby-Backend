class AddShopifyIdsToCollects < ActiveRecord::Migration[5.2]
  def change
    add_column :collects, :collection_shopify_id, :bigint
    add_column :collects, :product_shopify_id, :bigint
  end
end
