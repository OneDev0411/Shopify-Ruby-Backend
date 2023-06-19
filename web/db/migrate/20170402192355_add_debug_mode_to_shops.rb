class AddDebugModeToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :debug_mode, :boolean, null: false, default: false
  end
end
