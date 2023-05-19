class CreateDailyStats < ActiveRecord::Migration[5.2]
  def change
    create_table :daily_stats do |t|
      t.references :offer, index: true
      t.integer :times_loaded
      t.integer :times_clicked
      t.decimal :click_revenue

      t.timestamps null: false
    end
    add_foreign_key :daily_stats, :offers
  end
end
