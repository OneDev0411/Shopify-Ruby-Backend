class AddCustomCartUrlToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :custom_cart_url, :string
  end
end
