class AddPoweredByToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :show_powered_by, :boolean, null: false, default: false
  end
end
