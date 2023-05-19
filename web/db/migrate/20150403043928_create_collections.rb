class CreateCollections < ActiveRecord::Migration[5.2]
  def change
    create_table :collections do |t|
      t.references :shop, index: true
      t.string :title
      t.integer :shopify_id
      t.timestamps null: false
    end
    add_foreign_key :collections, :shops
  end
end
