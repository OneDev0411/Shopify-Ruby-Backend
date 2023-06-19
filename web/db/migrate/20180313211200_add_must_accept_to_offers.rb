class AddMustAcceptToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :must_accept, :boolean
  end
end
