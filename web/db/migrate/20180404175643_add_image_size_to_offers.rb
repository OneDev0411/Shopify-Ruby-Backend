class AddImageSizeToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :product_image_size, :string
  end
end
