class AddOfferableProductIdsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :offerable_product_shopify_ids, :integer, array: true, default: []
  end
end
