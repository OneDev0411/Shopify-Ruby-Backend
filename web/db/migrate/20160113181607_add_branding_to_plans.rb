class AddBrandingToPlans < ActiveRecord::Migration[5.2]
  def change
    add_column :plans, :has_branding, :boolean, null: false, default: false
    add_column :subscriptions, :has_branding, :boolean
  end
end
