class CreateCustomers < ActiveRecord::Migration[5.2]
  def change
    create_table :customers do |t|
      t.bigint :shopify_id
      t.references :shop, index: true
      t.string :email

      t.timestamps null: false
    end
    add_foreign_key :customers, :shops
  end
end
