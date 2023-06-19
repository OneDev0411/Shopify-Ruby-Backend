class AddCountryToOrders < ActiveRecord::Migration[5.2]
  def change
    add_column :orders, :shopper_country, :string
    add_column :orders, :discount_code, :string
  end
end
