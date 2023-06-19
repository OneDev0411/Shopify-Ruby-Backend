class AddStoreInfoToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :opened_at, :datetime
    add_column :shops, :shopify_plan_name, :string
    add_column :shops, :custom_domain, :string
  end
end
