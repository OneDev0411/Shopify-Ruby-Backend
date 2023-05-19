class AddCssToThemes < ActiveRecord::Migration[5.2]
  def change
    add_column :themes, :css, :text
  end
end
