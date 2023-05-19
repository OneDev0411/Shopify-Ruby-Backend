class AddFrameInsertionLocations < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :in_cart_page, :boolean, default: true
    add_column :offers, :in_ajax_cart, :boolean, default: false
    add_column :offers, :in_product_page, :boolean, default: false
  end
end
