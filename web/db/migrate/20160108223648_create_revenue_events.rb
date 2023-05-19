class CreateRevenueEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :revenue_events do |t|
      t.text :description
      t.decimal :mrr
      t.references :shop, index: true
      t.decimal :amount

      t.timestamps null: false
    end
    add_foreign_key :revenue_events, :shops
  end
end
