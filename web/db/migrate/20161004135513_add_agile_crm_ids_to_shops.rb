class AddAgileCrmIdsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :agilecrm_company_id, :bigint
    add_column :shops, :agilecrm_contact_id, :bigint
  end
end
