class AddThemeToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :theme, :string
  end
end
