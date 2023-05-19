class CreateOfferEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :offer_events do |t|
      t.string :uuid
      t.string :action
      t.integer :offer_id
      t.string :offer_variant
      t.jsonb :options
      t.date :shop_date
      t.string :cart_token
      t.bigint :client_timestamp
      t.bigint :shop_timestamp

      t.timestamps null: false

      t.index :uuid, unique: true
      t.index :offer_id
    end
  end
end
