class AddShopifyAssetUrlToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :shopify_asset_url, :text
  end
end
