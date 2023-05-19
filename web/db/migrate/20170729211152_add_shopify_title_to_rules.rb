class AddShopifyTitleToRules < ActiveRecord::Migration[5.2]
  def change
    add_column :rules, :item_shopify_title, :text
  end
end
