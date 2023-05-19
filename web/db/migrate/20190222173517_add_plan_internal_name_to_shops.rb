class AddPlanInternalNameToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :shopify_plan_internal_name, :string
  end
end
