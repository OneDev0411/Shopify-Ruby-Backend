class AddStatusToProduct < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :status, :integer, default: 1
  end
end
