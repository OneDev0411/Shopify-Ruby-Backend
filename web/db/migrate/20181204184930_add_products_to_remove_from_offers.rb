class AddProductsToRemoveFromOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :products_to_remove, :jsonb
  end
end
