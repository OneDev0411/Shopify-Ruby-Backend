class AddDiscountProductIdToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :recharge_discount_product_id, :integer
  end
end
