class AddHasDiscountsToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :has_discounts, :boolean, null: false, default: false
  end
end
