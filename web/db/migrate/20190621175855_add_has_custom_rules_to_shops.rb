class AddHasCustomRulesToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :has_custom_rules, :boolean
  end
end
