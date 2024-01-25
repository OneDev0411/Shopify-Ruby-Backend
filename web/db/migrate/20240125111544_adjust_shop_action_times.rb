class AdjustShopActionTimes < ActiveRecord::Migration[7.0]
  def change
    remove_column :shop_actions, :action_timestamp
    add_column :shop_actions, :action_timestamp, :int
    remove_column :shop_actions, :updated_at
  end
end
