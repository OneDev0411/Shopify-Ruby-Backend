class EmbiggenOfferEventIds < ActiveRecord::Migration[5.2]
  def change
    change_column :offer_events, :papertrail_id, :bigint, unique: true
  end
end
