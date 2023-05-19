class AddUsesGtmToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :uses_gtm, :boolean
  end
end
