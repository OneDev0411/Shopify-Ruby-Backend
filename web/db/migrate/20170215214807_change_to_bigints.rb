class ChangeToBigints < ActiveRecord::Migration[5.2]
  def up
    change_column :products, :recharge_discount_product_id, :bigint
  end

  def down
    change_column :products, :recharge_discount_product_id, :integer
  end
end
