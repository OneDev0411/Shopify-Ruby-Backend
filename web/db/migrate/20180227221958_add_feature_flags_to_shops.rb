class AddFeatureFlagsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :feature_flags, :jsonb
  end
end
