class AddCollectsToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :collects_json, :jsonb
  end
end
