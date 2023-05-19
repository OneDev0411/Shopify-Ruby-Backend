class AddParenthesizedPriceToVariants < ActiveRecord::Migration[5.2]
  def change
    add_column :variants, :parenthesized_price, :string
  end
end
