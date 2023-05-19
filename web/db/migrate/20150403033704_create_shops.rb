class CreateShops < ActiveRecord::Migration[5.2]
  def change
    create_table :shops do |t|
      t.string :name
      t.string :myshopify_domain
      t.bigint :shopify_id
      t.string :email
      t.string :timezone
      t.string :iana_timezone
      t.string :api_token
      t.datetime :installed_at
      t.datetime :activated_at
      t.datetime :frozen_at
      t.datetime :uninstalled_at

      t.timestamps null: false
    end
  end
end
