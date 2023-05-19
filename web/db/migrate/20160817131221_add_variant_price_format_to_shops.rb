class AddVariantPriceFormatToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :variant_price_format, :string, nil: false, default: "({{ formatted_price }})"
  end
end
