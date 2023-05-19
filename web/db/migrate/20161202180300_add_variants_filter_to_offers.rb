class AddVariantsFilterToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :variants_filter, :string
  end
end
