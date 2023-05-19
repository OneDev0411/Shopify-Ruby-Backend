class AddTotalToOrders < ActiveRecord::Migration[5.2]
  def change
    add_column :orders, :total, :decimal
  end
end
