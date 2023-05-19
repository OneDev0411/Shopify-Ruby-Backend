class AddDefaultPresentmentCurrencyToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :default_presentment_currency, :string
  end
end
