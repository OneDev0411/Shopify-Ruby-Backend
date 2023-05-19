class AddHiddenVariantIdsToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :hidden_variant_shopify_ids, :jsonb
  end
end
