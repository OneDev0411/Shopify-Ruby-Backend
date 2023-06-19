class AddShopIdToStats < ActiveRecord::Migration[5.2]
  def change
    add_column :daily_stats, :shop_id, :integer
    add_index :daily_stats, :shop_id
    add_index :daily_stats, :for_date
  end
end
