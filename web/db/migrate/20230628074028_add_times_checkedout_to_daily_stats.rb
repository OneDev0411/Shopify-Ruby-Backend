class AddTimesCheckedoutToDailyStats < ActiveRecord::Migration[7.0]
  def change
    unless column_exists?(:daily_stats, :times_checkedout)
      add_column :daily_stats, :times_checkedout, :integer, default: 0, null: false
    end
  end
end
