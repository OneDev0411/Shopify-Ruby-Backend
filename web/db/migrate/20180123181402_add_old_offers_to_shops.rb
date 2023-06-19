class AddOldOffersToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :old_offers, :jsonb
  end
end
