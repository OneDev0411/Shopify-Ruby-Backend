class AddFieldsToUsageCharge < ActiveRecord::Migration[5.2]
  def change
    add_column :usage_charges, :shopify_id, :bigint
  end
end
