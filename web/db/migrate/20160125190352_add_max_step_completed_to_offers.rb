class AddMaxStepCompletedToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :max_step_completed, :integer, null:false, default: 0
  end
end
