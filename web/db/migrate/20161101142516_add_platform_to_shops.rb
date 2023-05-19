class AddPlatformToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :platform, :string, null: false, default: "shopify"
  end
end
