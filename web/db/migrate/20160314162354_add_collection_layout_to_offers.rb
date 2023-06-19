class AddCollectionLayoutToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :collection_layout, :string
  end
end
