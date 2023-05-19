class RenameSubscriptionCardToken < ActiveRecord::Migration[5.2]
  def change
    rename_column :subscriptions, :stripe_card_token, :stripe_customer_token
  end
end
