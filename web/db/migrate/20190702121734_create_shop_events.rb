class CreateShopEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :shop_events do |t|
      t.references :shop, index: true, foreign_key: true
      t.string :title
      t.text :body
      t.decimal :revenue_impact

      t.timestamps null: false
    end
  end
end
