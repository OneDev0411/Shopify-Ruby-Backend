class CreatePendingJobs < ActiveRecord::Migration[5.2]
  def change
    create_table :pending_jobs do |t|
      t.references :shop, index: true
      t.bigint :job_id
      t.text :description

      t.timestamps null: false
    end
    add_foreign_key :pending_jobs, :shops
  end
end
