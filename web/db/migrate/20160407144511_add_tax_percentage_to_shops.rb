class AddTaxPercentageToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :tax_percentage, :decimal
  end
end
