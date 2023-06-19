class AddBuilderVersionToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :builder_version, :integer
  end
end
