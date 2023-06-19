class AddStartedWizardAtToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :started_wizard_at, :datetime
  end
end
