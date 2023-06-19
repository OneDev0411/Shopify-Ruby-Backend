class AddSoftRefreshOnlyToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :soft_purge_only, :boolean
  end
end
