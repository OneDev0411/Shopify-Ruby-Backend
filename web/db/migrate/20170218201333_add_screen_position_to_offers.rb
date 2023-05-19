class AddScreenPositionToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :screen_position, :string
  end
end
