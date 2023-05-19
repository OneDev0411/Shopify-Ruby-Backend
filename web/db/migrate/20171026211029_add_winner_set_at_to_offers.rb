class AddWinnerSetAtToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :winner_picked_at, :datetime
  end
end
