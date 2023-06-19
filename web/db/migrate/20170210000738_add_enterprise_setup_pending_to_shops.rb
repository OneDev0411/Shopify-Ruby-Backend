class AddEnterpriseSetupPendingToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :pending_enterprise_setup, :boolean
  end
end
