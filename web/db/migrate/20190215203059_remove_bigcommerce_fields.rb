class RemoveBigcommerceFields < ActiveRecord::Migration[5.2]
  def up
    # remove_column :shops, :bigcommerce_token
    # remove_column :shops, :bigcommerce_context
    # remove_column :shops, :bigcommerce_name
    # remove_column :shops, :bigcommerce_client_secret
    # remove_column :shops, :bigcommerce_client_id
    # remove_column :shops, :bigcommerce_user_id
    remove_column :shops, :weebly_user_id
    remove_column :shops, :weebly_site_id
    remove_column :shops, :weebly_token
    remove_column :shops, :agilecrm_company_id
    remove_column :shops, :agilecrm_contact_id

    remove_column :products, :bigcommerce_categories

    remove_column :products, :ecwid_id
    remove_column :products, :backup_id
  end

  def down
  end
end
