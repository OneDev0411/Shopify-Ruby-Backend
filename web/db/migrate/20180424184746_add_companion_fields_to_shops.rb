class AddCompanionFieldsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :companions_status, :string
    add_column :shops, :companions_status_updated_at, :datetime
  end
end
