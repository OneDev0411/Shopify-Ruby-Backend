class AddJsVersionToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :js_version, :string
  end
end
