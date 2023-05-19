class AddBillDateToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :bill_on, :date
  end
end
