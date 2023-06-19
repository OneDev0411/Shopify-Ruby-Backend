class AddStatsFromInShops < ActiveRecord::Migration[6.1]
  def change
    add_column :shops, :stats_from, :datetime
  end
end
