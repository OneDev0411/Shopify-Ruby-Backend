class AddWeightedSuggestionsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :has_weighted_autopilot, :boolean
  end
end
