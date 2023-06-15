class Shops < ActiveRecord::Migration[6.1]
  def change
    unless column_exists?(:shops, :unpublished_offer_ids)
      add_column :shops, :unpublished_offer_ids, :integer, array: true
    end
  end
end
