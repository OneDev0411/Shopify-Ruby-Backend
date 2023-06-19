class CreateMarketingTargets < ActiveRecord::Migration[6.1]
  def up
    create_table :marketing_targets do |t|
      t.references :marketing, null: false
      t.boolean :is_invited, default: false
      t.boolean :has_accepted, default: false
      t.string :email, null: false
      t.string :store_url
      t.string :secret_code, null: false
    end
    add_index :marketing_targets, :email
    add_index :marketing_targets, [:marketing_id, :email], unique: true     # same email can't be invited twice for the same marketing
    add_index :marketing_targets, [:marketing_id, :store_url], unique: true # same store can't be invited twice for the same marketing
  end

  def down
    drop_table :marketing_targets
  end
end
