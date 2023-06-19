class AddCurrencyUnitsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :currency_units, :string, null: false, default: '$'
  end
end
