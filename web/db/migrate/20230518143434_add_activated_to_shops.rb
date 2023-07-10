class AddActivatedToShops < ActiveRecord::Migration[6.1]
  def change
    unless column_exists?(:shops, :activated)
      add_column :shops, :activated, :boolean
    end
  end
end
