class AddRawClicksToDailyStats < ActiveRecord::Migration[5.2]
  def change
    add_column :daily_stats, :clicks, :jsonb
  end
end
