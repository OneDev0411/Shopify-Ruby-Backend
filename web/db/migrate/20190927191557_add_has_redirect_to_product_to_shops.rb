class AddHasRedirectToProductToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :has_redirect_to_product, :boolean
  end
end
