class AddPublishJobToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :publish_job, :string
  end
end
