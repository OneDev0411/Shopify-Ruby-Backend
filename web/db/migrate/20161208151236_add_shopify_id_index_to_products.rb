class AddShopifyIdIndexToProducts < ActiveRecord::Migration[5.2]
  def change
    add_index :products, :shopify_id
  end
end
