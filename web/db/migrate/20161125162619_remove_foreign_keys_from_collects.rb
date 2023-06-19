class RemoveForeignKeysFromCollects < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key "collects", "collections"
    remove_foreign_key "collects", "products"
  end
end
