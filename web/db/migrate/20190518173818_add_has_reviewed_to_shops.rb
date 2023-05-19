class AddHasReviewedToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :has_reviewed, :boolean
  end
end
