class AddIndexOnShopsUninstalledAt < ActiveRecord::Migration[5.2]
  def up
    add_index :shops, :uninstalled_at
  end
  def down
    remove_index :shops, :uninstalled_at
  end
end
