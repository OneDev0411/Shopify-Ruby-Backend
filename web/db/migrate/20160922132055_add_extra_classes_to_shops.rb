class AddExtraClassesToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :extra_css_classes, :string
  end
end
