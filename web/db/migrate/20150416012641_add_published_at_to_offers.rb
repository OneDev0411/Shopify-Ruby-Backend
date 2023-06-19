class AddPublishedAtToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :published_at, :datetime
  end
end
