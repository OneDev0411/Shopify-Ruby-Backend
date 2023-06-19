class AddOrdersCountToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :orders_count, :integer
  end
end
