class AddHasOffersInCheckoutToPlans < ActiveRecord::Migration[5.2]
  def change
    add_column :plans, :has_offers_in_checkout, :boolean, nil: false, default: false
  end
end
