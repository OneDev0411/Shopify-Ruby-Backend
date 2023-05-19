class CreateCases < ActiveRecord::Migration[5.2]
  def change
    create_table :cases do |t|
      t.references :shop, index: true
      t.string :status
      t.text :subject
      t.string :category
      t.string :email

      t.timestamps null: false
    end
  end
end
