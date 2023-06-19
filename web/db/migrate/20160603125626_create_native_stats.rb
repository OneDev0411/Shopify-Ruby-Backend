class CreateNativeStats < ActiveRecord::Migration[5.2]
  def change
    create_table :native_stats do |t|
      t.references :shop, index: true
      t.references :offer, index: true
      t.integer :views
      t.integer :clicks
      t.decimal :click_revenue
      t.integer :purchases
      t.decimal :purchase_revenue
      t.integer :orig_views
      t.integer :orig_clicks
      t.integer :alt_views
      t.integer :alt_clicks
      t.jsonb :conversions
      t.date :for_date

      t.timestamps null: false
    end
  end
end
