class CreateSubscriptions < ActiveRecord::Migration[5.2]
  def change
    create_table :subscriptions do |t|
      t.references :plan, index: true
      t.references :shop, index: true
      t.integer :price_in_cents
      t.integer :offers_limit
      t.integer :views_limit
      t.boolean :advanced_stats
      t.string :status
      t.bigint :shopify_charge_id

      t.timestamps null: false
    end
    add_foreign_key :subscriptions, :plans
    add_foreign_key :subscriptions, :shops
  end
end
