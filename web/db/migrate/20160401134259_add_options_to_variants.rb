class AddOptionsToVariants < ActiveRecord::Migration[5.2]
  def change
    add_column :variants, :option1, :string
    add_column :variants, :option2, :string
    add_column :variants, :option3, :string
  end
end
