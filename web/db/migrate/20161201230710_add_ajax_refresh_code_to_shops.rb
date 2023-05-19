class AddAjaxRefreshCodeToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :ajax_refresh_code, :text
  end
end
