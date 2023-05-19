class AddRemoveIfNotValidToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :remove_if_no_longer_valid, :boolean, null: false, default: false
  end
end
