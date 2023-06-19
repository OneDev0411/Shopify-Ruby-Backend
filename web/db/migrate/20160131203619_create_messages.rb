class CreateMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :messages do |t|
      t.references :case, index: true
      t.references :shop, index: true
      t.text :body

      t.timestamps null: false
    end
  end
end
