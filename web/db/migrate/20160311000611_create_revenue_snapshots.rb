class CreateRevenueSnapshots < ActiveRecord::Migration[5.2]
  def change
    create_table :revenue_snapshots do |t|
      t.integer :trial_amount_in_cents
      t.integer :trial_count
      t.integer :subscription_amount_in_cents
      t.integer :subscription_count
      t.date :for_date

      t.timestamps null: false
    end
  end
end
