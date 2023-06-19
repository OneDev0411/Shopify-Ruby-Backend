class AddImagesToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :images_json, :jsonb
  end
end
