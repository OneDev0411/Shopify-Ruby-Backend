class AddRuleSelectorsToRules < ActiveRecord::Migration[5.2]
  def change
    add_column :rules, :rule_selector, :string
    add_column :rules, :item_name, :string
    add_column :rules, :item_type_name, :string
  end
end
