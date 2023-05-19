class CreateFeatureRequests < ActiveRecord::Migration[5.2]
  def change
    create_table :feature_requests do |t|
      t.string :title
      t.text :description
      t.integer :shop_id
      t.integer :upvotes
      t.integer :downvotes

      t.timestamps null: false
    end
  end
end
