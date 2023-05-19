class AddSortOrderToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :sort_order, :string
    add_column :collections, :products_count, :integer
  end
end
