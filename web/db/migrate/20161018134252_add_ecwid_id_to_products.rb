class AddEcwidIdToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :ecwid_id, :integer
  end
end
