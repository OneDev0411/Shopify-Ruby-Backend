class CreateShopActions < ActiveRecord::Migration[7.0]
  def change
    create_table :shop_actions do |t|
      t.references :shop, foreign_key: true
      t.timestamp :action_timestamp
      t.string :shopify_domain
      t.string :action
      t.string :source
      t.timestamps
    end
  end
end
