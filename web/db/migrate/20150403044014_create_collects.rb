class CreateCollects < ActiveRecord::Migration[5.2]
  def change
    create_table :collects do |t|
      t.references :collection, index: true
      t.references :product, index: true
      t.integer :shopify_id
      t.timestamps null: false
    end
    add_foreign_key :collects, :collections
    add_foreign_key :collects, :products
  end
end
