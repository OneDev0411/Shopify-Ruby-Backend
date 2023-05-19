class AddCartTypePathToThemes < ActiveRecord::Migration[5.2]
  def change
    add_column :themes, :cart_type_path, :string
  end
end
