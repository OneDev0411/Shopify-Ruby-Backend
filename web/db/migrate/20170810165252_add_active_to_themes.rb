class AddActiveToThemes < ActiveRecord::Migration[5.2]
  def change
    add_column :themes, :active, :boolean, null: false, default: false
  end
end
