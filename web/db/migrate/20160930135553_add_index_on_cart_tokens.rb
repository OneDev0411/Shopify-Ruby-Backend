class AddIndexOnCartTokens < ActiveRecord::Migration[5.2]
  def change
    add_index :orders, :cart_token
  end
end
