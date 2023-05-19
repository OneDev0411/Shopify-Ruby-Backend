class ChangeShopifyIdsToBigints < ActiveRecord::Migration[5.2]
  def self.up
    change_column :products, :shopify_id, :bigint
    change_column :variants, :shopify_id, :bigint
    change_column :collections, :shopify_id, :bigint
    change_column :collects, :shopify_id, :bigint
  end
  def self.down
    change_column :products, :shopify_id, :integer
    change_column :variants, :shopify_id, :integer
    change_column :collections, :shopify_id, :integer
    change_column :collects, :shopify_id, :integer
  end
end
