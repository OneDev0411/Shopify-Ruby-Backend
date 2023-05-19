class DefaultShopsToPureJs < ActiveRecord::Migration[5.2]
  def up
    change_column_default(:shops, :use_pure_js, :true)
  end
  def down
    change_column_default(:shops, :use_pure_js, :false)
  end
end
