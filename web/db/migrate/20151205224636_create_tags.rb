class CreateTags < ActiveRecord::Migration[5.2]
  def change
    create_table :tags do |t|
      t.string :body
      t.references :customer, index: true

      t.timestamps null: false
    end
    add_foreign_key :tags, :customers
  end
end
