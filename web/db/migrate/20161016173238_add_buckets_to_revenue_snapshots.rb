class AddBucketsToRevenueSnapshots < ActiveRecord::Migration[5.2]
  def change
    add_column :revenue_snapshots, :trial_data, :jsonb
    add_column :revenue_snapshots, :bucket_data, :jsonb
  end
end
