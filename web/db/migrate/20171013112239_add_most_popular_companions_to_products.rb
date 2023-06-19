class AddMostPopularCompanionsToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :most_popular_companions, :jsonb
    add_column :products, :most_popular_companions_updated_at, :datetime
  end
end
