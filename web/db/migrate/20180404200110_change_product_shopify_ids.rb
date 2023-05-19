class ChangeProductShopifyIds < ActiveRecord::Migration[5.2]
  def change
    # add_column :offers, :offerable_product_shopify_ids_b, :bigint, array: true, default: []
    change_column :offers, :offerable_product_shopify_ids, :bigint, array: true, default: []
  end
end
