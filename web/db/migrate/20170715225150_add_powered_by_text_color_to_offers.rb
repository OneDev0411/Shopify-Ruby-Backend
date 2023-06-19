class AddPoweredByTextColorToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :powered_by_text_color, :string
    add_column :offers, :powered_by_link_color, :string
  end
end
