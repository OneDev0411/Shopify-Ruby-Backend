class CreateUsageCharges < ActiveRecord::Migration[5.2]
  def change
    create_table :usage_charges do |t|
      t.integer :subscription_id
      t.integer :amount_cents
      t.string :result

      t.timestamps null: false
    end
  end
end
