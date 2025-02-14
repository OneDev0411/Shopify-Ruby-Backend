class CreateShopActions < ActiveRecord::Migration[7.0]
  def change
    unless table_exists?(:shop_actions)
      create_table :shop_actions do |t|
        t.references :shop, foreign_key: true
        t.integer :action_timestamp
        t.string :shopify_domain
        t.string :action
        t.string :source
        t.datetime :created_at, null: false
      end
    end
  end
end