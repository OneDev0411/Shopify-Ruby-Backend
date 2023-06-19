class AddShopDomainToShops < ActiveRecord::Migration[6.1]
  def change
    add_column :shops, :shop_domain, :string
  end
end
