class AddCustomSelectorToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :custom_dom_selector, :text
  end
end
