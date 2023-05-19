class AddSidekiqIdToPendingJobs < ActiveRecord::Migration[5.2]
  def change
    add_column :pending_jobs, :sidekiq_id, :string
  end
end
