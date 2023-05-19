class CreateRules < ActiveRecord::Migration[5.2]
  def change
    create_table :rules do |t|
      t.references :offer, index: true
      t.integer :item_id
      t.string :item_type
      t.boolean :presence

      t.timestamps null: false
    end
    add_foreign_key :rules, :offers
  end
end
