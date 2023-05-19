class AddUseHugeImageToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :use_huge_image, :boolean, null: false, default: false
  end
end
