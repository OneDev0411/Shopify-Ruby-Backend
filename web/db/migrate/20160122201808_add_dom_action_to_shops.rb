class AddDomActionToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :custom_dom_action, :string
  end
end
