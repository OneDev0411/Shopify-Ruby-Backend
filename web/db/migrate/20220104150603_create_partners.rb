class CreatePartners < ActiveRecord::Migration[5.2]
  def change
    create_table :partners do |t|
      t.string :image, null: false
      t.text :description, null: false
      t.string :name, null: false
      t.string :app_url, null: false

      t.timestamps null: false
    end

    add_index :partners, :name, :unique => true
    add_index :partners, :app_url, :unique => true
    add_index :partners, :description, :unique => true
  end
end
