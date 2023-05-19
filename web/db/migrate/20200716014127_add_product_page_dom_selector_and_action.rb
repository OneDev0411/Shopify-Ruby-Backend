class AddProductPageDomSelectorAndAction < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :custom_product_page_dom_selector, :string
    add_column :shops, :custom_product_page_dom_action, :string
  end
end
