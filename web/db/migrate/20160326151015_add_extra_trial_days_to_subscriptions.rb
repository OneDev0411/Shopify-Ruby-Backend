class AddExtraTrialDaysToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :extra_trial_days, :integer, null: false, default: 0
    add_column :subscriptions, :trial_ends_at, :datetime
  end
end
