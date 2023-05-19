class AddShopToTags < ActiveRecord::Migration[5.2]
  def change
    add_column :tags, :shop_id, :integer
    add_index :tags, :shop_id
  end
end
