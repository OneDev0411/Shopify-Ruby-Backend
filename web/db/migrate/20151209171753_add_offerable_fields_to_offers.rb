class AddOfferableFieldsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :offerable_id, :integer
    add_column :offers, :offerable_type, :string
  end
end
