class AddGeoOffersToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :has_geo_offers, :boolean
  end
end
