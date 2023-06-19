class AddDateToDailyStat < ActiveRecord::Migration[5.2]
  def change
    add_column :daily_stats, :for_date, :date
  end
end
