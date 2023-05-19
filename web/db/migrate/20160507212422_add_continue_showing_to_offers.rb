class AddContinueShowingToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :stop_showing_after_accepted, :boolean, null: false, default: false
  end
end
