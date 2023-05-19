class AddWinnerPickedByToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :winner_picked_by, :string
  end
end
