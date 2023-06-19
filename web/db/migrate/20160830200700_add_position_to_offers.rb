class AddPositionToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :position, :integer
  end
end
