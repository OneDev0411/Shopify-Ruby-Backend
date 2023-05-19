class AddExcludedTagsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :excluded_tags, :jsonb
  end
end
