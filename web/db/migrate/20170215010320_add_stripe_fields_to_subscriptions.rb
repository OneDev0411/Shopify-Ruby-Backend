class AddStripeFieldsToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :stripe_email, :string
    add_column :subscriptions, :stripe_card_token, :string
    add_column :subscriptions, :platform, :string
    add_column :subscriptions, :stripe_customer_token, :string
  end
end
