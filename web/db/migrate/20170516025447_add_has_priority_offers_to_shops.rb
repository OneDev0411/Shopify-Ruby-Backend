class AddHasPriorityOffersToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :has_custom_priorities, :boolean
  end
end
