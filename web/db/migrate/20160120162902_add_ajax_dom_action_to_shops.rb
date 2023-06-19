class AddAjaxDomActionToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :custom_ajax_dom_action, :string
  end
end
