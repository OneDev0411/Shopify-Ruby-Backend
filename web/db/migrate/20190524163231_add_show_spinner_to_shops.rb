class AddShowSpinnerToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :show_spinner, :boolean
  end
end
