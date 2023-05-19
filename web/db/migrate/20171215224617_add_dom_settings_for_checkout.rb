class AddDomSettingsForCheckout < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :custom_checkout_dom_selector, :string
    add_column :shops, :custom_checkout_dom_action, :string
  end
end
