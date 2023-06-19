class CreateOfferStats < ActiveRecord::Migration[5.2]
  def change
    create_table :offer_stats do |t|
      t.references :offer, index: true, foreign_key: true
      t.integer :place   # , comment: 'Values: cart: 1, ajax: 2, product: 3 '
      t.integer :variant_id
      t.string :test_ab
      t.string :action

      t.timestamps null: false
    end
  end

  # def self.up
  #   execute "ALTER TABLE offer_stats ADD CONSTRAINT check_constraint_place CHECK (place IN (1, 2, 3) )"
  # end
end
