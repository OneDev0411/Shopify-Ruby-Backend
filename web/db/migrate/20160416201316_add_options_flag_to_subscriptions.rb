class AddOptionsFlagToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :has_match_options, :boolean
  end
end
