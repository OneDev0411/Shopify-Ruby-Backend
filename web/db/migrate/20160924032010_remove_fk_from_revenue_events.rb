class RemoveFkFromRevenueEvents < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :revenue_events, :shops
  end
end
