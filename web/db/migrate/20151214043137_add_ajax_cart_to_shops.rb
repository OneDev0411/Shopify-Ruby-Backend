class AddAjaxCartToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :uses_ajax_cart, :boolean, null: false, default: false
  end
end
