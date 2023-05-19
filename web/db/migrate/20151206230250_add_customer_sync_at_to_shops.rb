class AddCustomerSyncAtToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :last_customer_sync_at, :datetime
  end
end
