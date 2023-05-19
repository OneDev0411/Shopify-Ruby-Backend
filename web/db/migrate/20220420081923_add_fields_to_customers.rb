class AddFieldsToCustomers < ActiveRecord::Migration[6.1]
  def change
    add_column :customers, :shopify_domain, :string
    add_column :customers, :referral_code, :string
    add_column :customers, :is_referral_tracked, :boolean
  end
end
