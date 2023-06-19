class AddIncludedVariantsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :included_variants, :jsonb
  end
end
