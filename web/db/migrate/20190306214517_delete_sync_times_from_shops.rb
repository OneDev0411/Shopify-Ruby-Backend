class DeleteSyncTimesFromShops < ActiveRecord::Migration[5.2]
  def up
    remove_column :shops, :sync_times
    remove_column :shops, :ecwid_shop_id
    remove_column :shops, :ecwid_access_token
    remove_column :shops, :trello_card_id
    remove_column :shops, :pending_enterprise_setup
  end
end
