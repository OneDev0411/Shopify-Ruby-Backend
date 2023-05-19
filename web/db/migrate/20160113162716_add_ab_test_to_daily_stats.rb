class AddAbTestToDailyStats < ActiveRecord::Migration[5.2]
  def change
    add_column :daily_stats, :times_orig_loaded, :integer
    add_column :daily_stats, :times_orig_clicked, :integer
    add_column :daily_stats, :times_alt_loaded, :integer
    add_column :daily_stats, :times_alt_clicked, :integer
  end
end
