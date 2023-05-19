class AddTrelloCardIdToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :trello_card_id, :string
  end
end
