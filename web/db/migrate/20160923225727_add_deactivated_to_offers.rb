class AddDeactivatedToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :deactivated_at, :datetime
  end
end
