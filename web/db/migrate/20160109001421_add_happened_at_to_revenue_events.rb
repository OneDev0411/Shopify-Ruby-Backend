class AddHappenedAtToRevenueEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :revenue_events, :happened_at, :datetime
  end
end
