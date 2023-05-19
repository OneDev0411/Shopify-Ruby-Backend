class AddIsAutoToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :is_auto, :boolean, null: false, default: false
  end
end
