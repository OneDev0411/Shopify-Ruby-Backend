class CreateOfferClicks < ActiveRecord::Migration[5.2]
  def change
    create_table :offer_clicks do |t|
      t.references :offer, index: true
      t.references :order, index: true
      t.string :cart_token
      t.string :variant
      t.datetime :clicked_at
      t.decimal :value
      t.timestamps null: false
    end
  end
end
