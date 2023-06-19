class AddJobIdToCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :collections, :job_id, :bigint
  end
end
