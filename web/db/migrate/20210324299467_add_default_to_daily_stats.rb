class AddDefaultToDailyStats < ActiveRecord::Migration[5.2]
  def change
    change_column :daily_stats, :times_loaded, :integer, null: false, default: 0
    change_column :daily_stats, :times_clicked, :integer, null: false, default: 0
    change_column :daily_stats, :times_orig_loaded, :integer, null: false, default: 0
    change_column :daily_stats, :times_orig_clicked, :integer, null: false, default: 0
    change_column :daily_stats, :times_alt_loaded, :integer, null: false, default: 0
    change_column :daily_stats, :times_alt_clicked, :integer, null: false, default: 0
    change_column_null :daily_stats, :click_revenue, from: nil, to: 0
    change_column_default :daily_stats, :click_revenue, 0
  end
end
