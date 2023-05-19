class AddStatProviderToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :stat_provider, :string
  end
end
