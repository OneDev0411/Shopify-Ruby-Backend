class AddAbTestToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :has_ajax_cart, :boolean
    add_column :subscriptions, :has_customer_tags, :boolean
    add_column :subscriptions, :has_ab_testing, :boolean
  end
end
