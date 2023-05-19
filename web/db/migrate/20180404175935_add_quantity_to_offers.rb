class AddQuantityToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :show_quantity_selector, :boolean
  end
end
