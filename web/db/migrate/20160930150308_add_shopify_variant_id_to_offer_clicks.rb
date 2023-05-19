class AddShopifyVariantIdToOfferClicks < ActiveRecord::Migration[5.2]
  def change
    add_column :offer_clicks, :shopify_variant_id, :bigint
  end
end
