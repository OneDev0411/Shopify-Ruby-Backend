class AddRechargeDiscountIdToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :recharge_discount_product_id, :integer
  end
end
