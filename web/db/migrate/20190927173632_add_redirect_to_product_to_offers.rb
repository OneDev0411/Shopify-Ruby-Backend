class AddRedirectToProductToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :redirect_to_product, :boolean
  end
end
