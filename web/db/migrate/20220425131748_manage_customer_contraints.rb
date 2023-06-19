class ManageCustomerContraints < ActiveRecord::Migration[6.1]
  def up
    add_index :customers, :shopify_domain, name: "index_customers_on_shopify_domain"
    add_index :customers, [:shopify_domain, :referral_code], unique: true, name: "index_customers_on_shopify_domain_and_referral_code"
  end

  def def down
    remove_index :customers, name: "index_customers_on_shopify_domain"
    remove_index :customers, name: "index_customers_on_shopify_domain_and_referral_code"
  end
end
