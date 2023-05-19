class AddProceedToCheckoutToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :checkout_after_accepted, :boolean
  end
end
