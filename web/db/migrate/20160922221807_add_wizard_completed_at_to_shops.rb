class AddWizardCompletedAtToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :wizard_completed_at, :datetime
  end
end
