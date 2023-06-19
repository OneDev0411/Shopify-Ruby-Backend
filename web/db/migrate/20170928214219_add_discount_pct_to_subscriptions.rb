class AddDiscountPctToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :discount_percent, :integer
  end
end
