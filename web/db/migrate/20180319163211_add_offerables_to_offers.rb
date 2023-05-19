class AddOfferablesToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :multi_offerables, :jsonb
  end
end
