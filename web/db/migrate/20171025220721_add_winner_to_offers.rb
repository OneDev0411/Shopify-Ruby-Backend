class AddWinnerToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :winner, :string
  end
end
