class AddGaClickIdToOfferClicks < ActiveRecord::Migration[5.2]
  def change
    add_column :offer_clicks, :ga_click_id, :string, index: true
  end
end
