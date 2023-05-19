class AddStockStatusToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :offerable_stock_status, :string
    add_column :offers, :offerable_stock_status_updated_at, :datetime
  end
end
