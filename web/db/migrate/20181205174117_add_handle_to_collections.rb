class AddHandleToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :handle, :string
  end
end
