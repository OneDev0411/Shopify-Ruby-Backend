class AddLocationToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :cart_page, :boolean
    add_column :offers, :cart_page_mobile, :boolean
    add_column :offers, :ajax_cart, :boolean
    add_column :offers, :ajax_cart_mobile, :boolean
    add_column :offers, :checkout_page, :boolean
    add_column :offers, :checkout_page_mobile, :boolean
  end
end
