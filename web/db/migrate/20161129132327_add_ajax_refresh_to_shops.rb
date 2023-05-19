class AddAjaxRefreshToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :uses_ajax_refresh, :boolean, null: false, default: false
  end
end
