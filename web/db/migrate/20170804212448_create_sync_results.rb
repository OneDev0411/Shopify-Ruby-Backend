class CreateSyncResults < ActiveRecord::Migration[5.2]
  def change
    create_table :sync_results do |t|
      t.references :shop, index: true
      t.integer :active_offers_count
      t.jsonb :active_offer_ids
      t.jsonb :offerable_products
      t.jsonb :offerable_collections
      t.jsonb :rule_products
      t.jsonb :rule_collections
      t.decimal :elapsed_time_seconds
      t.integer :result_code
      t.text :result_message
      t.boolean :republished
      t.integer :republish_result_code
      t.text :republish_message

      t.timestamps null: false
    end
  end
end
