class CreateMarketings < ActiveRecord::Migration[6.1]
  def up
    create_table :marketings do |t|
      t.string :code, null: false
      t.integer :discount_type, default: 0, null: false   # fixed, percentage, extned_trial_days - using as enum in the model, hence datatype integer
      t.integer :discount, default: 0       # fixed amount, percentage, number of trial days
      t.datetime :expires
      t.integer :usage_limit, default: 0, null: false
      t.integer :usage_counter, default: 0  # an iterator that should remain less than and equal to :usage_limit
      t.boolean :is_targeted, default: false    # if true, will only work for invited/targeted emails/stores

      t.timestamps null: false
    end
    add_index :marketings, :code, unique: true
    add_index :marketings, :discount_type
  end

  def down
    drop_table :marketings
  end
end
