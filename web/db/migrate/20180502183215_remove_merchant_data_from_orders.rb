class RemoveMerchantDataFromOrders < ActiveRecord::Migration[5.2]
  def up
    remove_column :orders, :merchant_data
  end

  def down
    add_column :orders, :merchant_data, :jsonb
  end
end
