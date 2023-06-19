class CreatePlans < ActiveRecord::Migration[5.2]
  def change
    create_table :plans do |t|
      t.string :name, nil: false
      t.integer :price_in_cents, nil: false, default: 0
      t.integer :offers_limit, nil: false, default: 0
      t.integer :views_limit, nil: false, default: 0
      t.boolean :advanced_stats, nil: false, default: false
      t.boolean :active, nil: false, default: true

      t.timestamps null: false
    end
  end
end
