class AddNeesCheckoutToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :needs_checkout_adjustment, :boolean, null: false, default: false
  end
end
