class AddOldIdToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :backup_id, :integer
    add_column :rules, :backup_id, :integer
  end
end
