class CreateSetups < ActiveRecord::Migration[5.2]
  def change
    create_table :setups do |t|
      t.references :shop, index: true, foreign_key: true
      t.jsonb :details

      t.timestamps null: false
    end
  end
end
