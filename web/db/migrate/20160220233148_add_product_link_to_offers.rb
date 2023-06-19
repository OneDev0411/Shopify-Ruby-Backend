class AddProductLinkToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :link_to_product, :boolean, null: false, default: false
  end
end
