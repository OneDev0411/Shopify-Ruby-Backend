class AddCdnToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :cdn, :string
  end
end
