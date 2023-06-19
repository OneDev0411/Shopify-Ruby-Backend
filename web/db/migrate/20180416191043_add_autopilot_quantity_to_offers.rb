class AddAutopilotQuantityToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :autopilot_quantity, :integer
  end
end
