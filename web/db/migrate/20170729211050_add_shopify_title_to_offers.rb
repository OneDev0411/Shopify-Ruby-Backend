class AddShopifyTitleToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :offerable_shopify_title, :text
  end
end
