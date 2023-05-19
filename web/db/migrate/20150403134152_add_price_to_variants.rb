class AddPriceToVariants < ActiveRecord::Migration[5.2]
  def change
    add_column :variants, :price, :decimal
  end
end
