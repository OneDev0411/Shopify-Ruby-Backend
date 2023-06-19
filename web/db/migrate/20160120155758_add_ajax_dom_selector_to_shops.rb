class AddAjaxDomSelectorToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :custom_ajax_dom_selector, :text
  end
end
