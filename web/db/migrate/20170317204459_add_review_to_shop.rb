class AddReviewToShop < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :review, :text
    add_column :shops, :review_added_at, :date
    # remove_column :shops, :has_reviewed
  end
end
