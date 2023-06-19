class AddBcCategoriesToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :bigcommerce_categories, :jsonb
  end
end
