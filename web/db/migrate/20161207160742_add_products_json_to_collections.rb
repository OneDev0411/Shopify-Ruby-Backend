class AddProductsJsonToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :products_json, :jsonb
  end
end
