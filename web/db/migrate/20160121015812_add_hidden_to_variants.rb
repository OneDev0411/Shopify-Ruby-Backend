class AddHiddenToVariants < ActiveRecord::Migration[5.2]
  def change
    add_column :variants, :hidden, :boolean, null: false, default: false
  end
end
