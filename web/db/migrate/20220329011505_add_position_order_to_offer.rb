class AddPositionOrderToOffer < ActiveRecord::Migration[6.1]
  def change
    add_column :offers, :position_order, :integer, default: 1
  end
end
