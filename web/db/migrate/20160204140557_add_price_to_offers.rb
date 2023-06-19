class AddPriceToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :show_variant_price, :boolean, null: false, default: false
  end
end
