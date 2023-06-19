class AddShopifyTokenUpdatedAtToShops < ActiveRecord::Migration[6.1]
  def up
    add_column :shops, :shopify_token_updated_at, :datetime
  end

  def down
    remove_column :shops, :shopify_token_updated_at
  end
end
