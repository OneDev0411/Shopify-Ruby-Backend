class AddCheckToRules < ActiveRecord::Migration[5.2]
  def change
    add_column :rules, :remove_when_offer_accepted, :boolean, null: false, default:false
  end
end
