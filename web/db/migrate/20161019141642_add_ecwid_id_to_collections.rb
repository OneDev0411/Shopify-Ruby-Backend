class AddEcwidIdToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :ecwid_id, :integer
  end
end
