class AddSkipResizeToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :skip_resize_cart, :boolean
  end
end
