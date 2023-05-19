class AddSubscriptionStateToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :shopify_subsription_status, :string
    add_column :shops, :shopify_subscription_history, :jsonb
    add_column :shops, :shopify_subscription_status_updated_at, :datetime
  end
end
