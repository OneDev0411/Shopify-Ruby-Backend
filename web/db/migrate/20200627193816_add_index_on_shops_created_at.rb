class AddIndexOnShopsCreatedAt < ActiveRecord::Migration[5.2]
  def up
    add_index :shops, :created_at
  end
  def down
    remove_index :shops, :created_at
  end
end
