class AddCustomCheckoutDestination < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :has_custom_checkout_destination, :boolean
    add_column :offers, :custom_checkout_destination, :text
  end
end
