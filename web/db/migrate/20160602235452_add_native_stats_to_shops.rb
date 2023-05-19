class AddNativeStatsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :native_stats, :boolean, null: false, default: false
  end
end
