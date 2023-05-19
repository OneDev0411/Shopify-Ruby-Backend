class AddCarouselPerPageToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :carousel_per_page, :integer
  end
end
