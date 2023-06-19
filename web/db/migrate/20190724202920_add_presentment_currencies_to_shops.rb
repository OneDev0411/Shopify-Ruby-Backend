class AddPresentmentCurrenciesToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :enabled_presentment_currencies, :jsonb
  end
end
