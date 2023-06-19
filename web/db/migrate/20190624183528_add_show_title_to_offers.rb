class AddShowTitleToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :show_product_title, :boolean, nil: false, default: true
    add_column :offers, :show_product_price, :boolean
  end
end
