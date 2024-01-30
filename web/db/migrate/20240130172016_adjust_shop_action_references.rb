class AdjustShopActionReferences < ActiveRecord::Migration[7.0]
  def change
    remove_reference :shop_actions, :shops, index: true, foreign_key: true
    add_reference :shop_actions, :shop, index: true, foreign_key: true
  end
end
