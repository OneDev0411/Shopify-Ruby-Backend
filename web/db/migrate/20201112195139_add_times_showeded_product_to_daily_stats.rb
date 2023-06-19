class AddTimesShowededProductToDailyStats < ActiveRecord::Migration[5.2]
  def change
    add_column :daily_stats, :times_showed_product, :integer, null: false, default: 0
    add_column :daily_stats, :times_showed_cart, :integer, null: false, default: 0
    add_column :daily_stats, :times_showed_popup, :integer, null: false, default: 0
    add_column :daily_stats, :times_clicked_product, :integer, null: false, default: 0
    add_column :daily_stats, :times_clicked_cart, :integer, null: false, default: 0
    add_column :daily_stats, :times_clicked_popup, :integer, null: false, default: 0
  end
end
