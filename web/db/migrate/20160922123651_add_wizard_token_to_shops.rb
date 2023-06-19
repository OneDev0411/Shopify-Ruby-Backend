class AddWizardTokenToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :wizard_token, :string
  end
end
