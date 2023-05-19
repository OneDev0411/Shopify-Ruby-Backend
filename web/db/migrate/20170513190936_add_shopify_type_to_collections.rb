class AddShopifyTypeToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :smart, :boolean
    add_column :collections, :conditions, :jsonb
    add_column :collections, :disjunctive, :boolean
  end
end
