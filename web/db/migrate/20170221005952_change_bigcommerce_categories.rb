class ChangeBigcommerceCategories < ActiveRecord::Migration[5.2]
  def up
    remove_column :products, :bigcommerce_categories
    add_column :products, :bigcommerce_categories, :text, array: true
  end
  def down
    remove_column :products, :bigcommerce_categories
    add_column :products, :bigcommerce_categories, :jsonb
  end

end
