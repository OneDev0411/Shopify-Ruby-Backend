class AddPapertrailIdToOfferEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :offer_events, :papertrail_id, :bigint, index: true, unique: true
  end
end
