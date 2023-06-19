class AddStripeTokenToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    rename_column :subscriptions, :stripe_customer_token, :stripe_token
  end
end
