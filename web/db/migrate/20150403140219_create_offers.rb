class CreateOffers < ActiveRecord::Migration[5.2]
  def change
    create_table :offers do |t|
      t.string :title
      t.references :shop, index: true
      t.references :product, index: true
      t.boolean :active

      t.timestamps null: false
    end
    add_foreign_key :offers, :shops
    add_foreign_key :offers, :products
  end
end
