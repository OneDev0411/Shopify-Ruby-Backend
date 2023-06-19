class AddPublishedStatusToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :published_status, :string
    add_column :products, :removed_at, :datetime
  end
end
