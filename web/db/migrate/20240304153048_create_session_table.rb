class CreateSessionTable < ActiveRecord::Migration[7.0]
  def change
    create_table :sessions do |t|
      t.string :session_id
      t.string :shop_domain
      t.string :state
      t.boolean :is_online
      t.string :access_token
      t.string :scope
      t.datetime :expires

      t.timestamps
    end
  end
end
