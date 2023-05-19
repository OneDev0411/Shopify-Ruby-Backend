class AddOfferCssToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :offer_css, :text
  end
end
