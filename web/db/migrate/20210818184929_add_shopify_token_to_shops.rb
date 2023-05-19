class AddShopifyTokenToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :shopify_token, :string
    add_column :shops, :shopify_domain, :string
    add_column :shops, :access_scopes, :string
  end
end
