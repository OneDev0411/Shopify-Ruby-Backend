class AddCollectionAnimationsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :collection_animations, :boolean, null: false, default: true
  end
end
