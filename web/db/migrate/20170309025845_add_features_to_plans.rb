class AddFeaturesToPlans < ActiveRecord::Migration[5.2]
  def change
    add_column :plans, :has_geo_offers, :boolean
    add_column :plans, :has_remove_offers, :boolean
  end
end
