class AddDefaultsSetAtToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :defaults_set_at, :datetime
    add_column :shops, :defaults_set_for, :string
    add_column :shops, :defaults_set_result, :text
  end
end
