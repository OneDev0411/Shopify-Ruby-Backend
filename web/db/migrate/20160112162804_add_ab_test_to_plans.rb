class AddAbTestToPlans < ActiveRecord::Migration[5.2]
  def change
    add_column :plans, :has_ajax_cart, :boolean
    add_column :plans, :has_customer_tags, :boolean
    add_column :plans, :has_ab_testing, :boolean
  end
end
