class AddVariantsJsonToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :variants_json, :jsonb
  end
end
