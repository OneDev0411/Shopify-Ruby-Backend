class AddOrderIdToOfferEvent < ActiveRecord::Migration[5.2]
  def change
    add_column :offer_events, :order_id, :bigint
  end
end
