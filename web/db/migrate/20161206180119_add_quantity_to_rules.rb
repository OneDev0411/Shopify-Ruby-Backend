class AddQuantityToRules < ActiveRecord::Migration[5.2]
  def change
    add_column :rules, :quantity, :integer
  end
end
