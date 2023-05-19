class AddHiddenProductsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :hidden_products_json, :jsonb
  end
end
