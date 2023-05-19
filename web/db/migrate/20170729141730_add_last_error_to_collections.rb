class AddLastErrorToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :last_error, :text
    add_column :collections, :last_error_happened_at, :datetime
  end
end
