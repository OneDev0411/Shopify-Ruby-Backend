class CreateShopActions < ActiveRecord::Migration[7.0]
  def change
    create_table :shop_actions do |t|
      t.references :shops, foreign_key: true
      t.integer :action_timestamp
      t.string :shopify_domain
      t.string :action
      t.string :source
      t.datetime :created_at, null: false
    end
  end
end