class AddMatchOptionsToRules < ActiveRecord::Migration[5.2]
  def change
    add_column :rules, :match_options, :jsonb
  end
end
