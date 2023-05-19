class AddIndexesToOffers < ActiveRecord::Migration[5.2]
  def change
    add_index :products, :title
    add_index :collections, :title
    add_index :tags, :body
  end
end
