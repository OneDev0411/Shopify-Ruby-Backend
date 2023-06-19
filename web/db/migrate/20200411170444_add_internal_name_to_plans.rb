class AddInternalNameToPlans < ActiveRecord::Migration[5.2]
  def change
    add_column :plans, :internal_name, :string
  end
end
