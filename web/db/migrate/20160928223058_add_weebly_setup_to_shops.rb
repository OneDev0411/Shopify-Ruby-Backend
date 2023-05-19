class AddWeeblySetupToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :weebly_user_id, :bigint
    add_column :shops, :weebly_site_id, :bigint
    add_column :shops, :weebly_token, :string
  end
end
