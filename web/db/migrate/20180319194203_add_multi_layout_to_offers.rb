class AddMultiLayoutToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :multi_layout, :string
  end
end
