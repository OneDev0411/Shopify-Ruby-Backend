class AddHasRemoveOfferToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :has_remove_offer, :boolean
  end
end
