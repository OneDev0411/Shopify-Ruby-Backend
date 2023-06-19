class AddMoneyFormatToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :money_format, :string
  end
end
