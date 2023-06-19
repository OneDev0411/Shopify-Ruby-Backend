class RecreatedOfferEvent < ActiveRecord::Migration[6.1]
  def change
    create_table :offer_events do |t|
      t.string :variant_id
      t.string :cart_token
      t.string :action
      t.float  :amount
      t.jsonb  :payload
      t.references :offer, index: true

      t.timestamps null: false
    end
    add_foreign_key :offer_events, :offers
  end
end
