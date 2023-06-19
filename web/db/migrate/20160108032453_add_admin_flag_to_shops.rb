class AddAdminFlagToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :admin, :boolean, null: false, default: false
  end
end
