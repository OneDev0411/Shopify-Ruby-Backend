class AddEcwidIdsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :ecwid_shop_id, :integer
    add_column :shops, :ecwid_access_token, :string
  end
end
