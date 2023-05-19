class AddDiscountCodeToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :discount_code, :string
  end
end
