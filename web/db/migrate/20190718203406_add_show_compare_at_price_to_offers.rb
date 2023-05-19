class AddShowCompareAtPriceToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :show_compare_at_price, :boolean
  end
end
