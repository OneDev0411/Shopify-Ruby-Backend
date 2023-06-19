class AddCartTypeToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :cart_type, :string
  end
end
