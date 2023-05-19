class AddHasAutopilotToPlans < ActiveRecord::Migration[5.2]
  def change
    add_column :plans, :has_autopilot, :boolean, null: false, default: false
  end
end
