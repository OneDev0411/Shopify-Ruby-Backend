class AddOrdersThroughOffersToShops < ActiveRecord::Migration[7.0]
  def change
    unless column_exists?(:shops, :orders_through_offers)
      add_column :shops, :orders_through_offers, :integer, default: 0, null: false
    end
  end
end
