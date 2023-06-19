class AddHasAutopilotToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :has_autopilot, :boolean
  end
end
