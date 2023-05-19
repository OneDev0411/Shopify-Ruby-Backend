class AddAmountToRules < ActiveRecord::Migration[5.2]
  def change
    add_column :rules, :amount, :integer
  end
end
