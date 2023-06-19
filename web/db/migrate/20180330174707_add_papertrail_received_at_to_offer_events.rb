class AddPapertrailReceivedAtToOfferEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :offer_events, :papertrail_received_at, :datetime
  end
end
