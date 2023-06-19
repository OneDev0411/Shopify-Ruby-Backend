class RemoveDailyStatsFk < ActiveRecord::Migration[5.2]
  def up
	  # remove_foreign_key :daily_stats, name: "fk_rails_8990f45b16"
  end
  def down
	  #add_foreign_key :daily_stats, :offer_id, name: "fk_rails_8990f45b16"
  end
end
