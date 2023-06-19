class AddShopifyVariantToOfferEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :offer_events, :product_shopify_id, :bigint
    add_column :offer_events, :product_variant_id, :bigint
    add_column :offer_events, :variant_price, :int
    add_column :offer_events, :product_title, :string
    add_column :offer_events, :variant_name, :string
  end
end
