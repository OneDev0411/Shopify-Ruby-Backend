class AddCanRunOnCheckoutToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :can_run_on_checkout_page, :boolean, null: false, default: false
  end
end
