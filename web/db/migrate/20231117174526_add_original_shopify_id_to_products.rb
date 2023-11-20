class AddOriginalShopifyIdToProducts < ActiveRecord::Migration[7.0]
  def change
    add_column :products, :original_shopify_id, :bigint
  end
end
