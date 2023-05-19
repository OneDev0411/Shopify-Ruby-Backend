class AddRulesetTypeToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :ruleset_type, :string, null: false, default: "and"
  end
end
