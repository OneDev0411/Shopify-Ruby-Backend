class AddFreePlanAfterTrialToSubscriptions < ActiveRecord::Migration[6.1]
  def change
    unless column_exists?(:subscriptions, :free_plan_after_trial)
      add_column :subscriptions, :free_plan_after_trial, :boolean
    end
  end
end
