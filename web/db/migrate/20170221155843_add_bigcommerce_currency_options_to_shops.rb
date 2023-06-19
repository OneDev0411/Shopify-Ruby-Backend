class AddBigcommerceCurrencyOptionsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :currency_decimal_separator, :string
    add_column :shops, :currency_thousands_separator,:string
    add_column :shops, :currency_decimal_places, :integer
    add_column :shops, :currency_symbol_location, :string
  end
end
