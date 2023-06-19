class AddStringPriceToVariants < ActiveRecord::Migration[5.2]
  def change
    add_column :variants, :str_price, :string
  end
end
