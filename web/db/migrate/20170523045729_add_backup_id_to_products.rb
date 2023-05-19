class AddBackupIdToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :backup_id, :int
  end
end
