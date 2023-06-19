class AddRulesJsonToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :rules_json, :jsonb
  end
end
