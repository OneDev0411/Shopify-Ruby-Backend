class UpdateActivatedDefaultInShops < ActiveRecord::Migration[6.1]
  def change
    change_column_default :shops, :activated, from: nil, to: true
  end
end
