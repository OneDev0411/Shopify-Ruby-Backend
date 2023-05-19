class AddShowImageToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :show_product_image, :boolean, null: false, default: false
  end
end
