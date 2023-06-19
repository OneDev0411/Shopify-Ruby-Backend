class RenameCustomDomSelectorAndActionToCart < ActiveRecord::Migration[5.2]
  def change
    rename_column :shops, :custom_dom_selector, :custom_cart_page_dom_selector
    rename_column :shops, :custom_dom_action, :custom_cart_page_dom_action
  end
end
