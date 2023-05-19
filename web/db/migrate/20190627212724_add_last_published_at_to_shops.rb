class AddLastPublishedAtToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :last_published_at, :datetime
  end
end
