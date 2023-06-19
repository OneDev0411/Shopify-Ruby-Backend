class AddOutOfStockToRules < ActiveRecord::Migration[5.2]
  def change
    add_column :rules, :item_stock_status, :string
    add_column :rules, :item_stock_status_updated_at, :datetime
  end
end
