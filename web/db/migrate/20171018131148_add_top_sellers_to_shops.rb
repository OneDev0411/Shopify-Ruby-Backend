class AddTopSellersToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :top_sellers, :jsonb
    add_column :shops, :top_sellers_updated_at, :datetime
  end
end
