class UpdateShopWithIsActive < ActiveRecord::Migration[7.0]
  def change
    add_column :shops, :is_shop_active, :boolean unless column_exists?(:shops, :is_shop_active)
  end
end
