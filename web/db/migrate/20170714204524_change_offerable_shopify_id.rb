class ChangeOfferableShopifyId < ActiveRecord::Migration[5.2]
  def change
    change_column :offers, :offerable_shopify_id, :bigint
  end
end
