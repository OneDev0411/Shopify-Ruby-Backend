class AddShopifyIdsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :offerable_shopify_id, :bigint
    add_column :rules, :item_shopify_id, :bigint
  end
end
