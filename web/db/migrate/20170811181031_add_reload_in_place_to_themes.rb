class AddReloadInPlaceToThemes < ActiveRecord::Migration[5.2]
  def change
    add_column :themes, :ajax_refresh_code, :text
  end
end
