class AddReferringSiteToOrders < ActiveRecord::Migration[5.2]
  def change
    add_column :orders, :referring_site, :text
    add_column :orders, :orders_count, :integer
  end
end
