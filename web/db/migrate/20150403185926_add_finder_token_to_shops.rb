class AddFinderTokenToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :finder_token, :string
  end
end
