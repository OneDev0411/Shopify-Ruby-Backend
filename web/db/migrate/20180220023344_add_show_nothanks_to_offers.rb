class AddShowNothanksToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :show_nothanks, :boolean
  end
end
