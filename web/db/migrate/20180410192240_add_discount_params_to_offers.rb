class AddDiscountParamsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :discount_target_type, :string
    add_column :offers, :discount_value, :decimal
    add_column :offers, :discount_value_type, :string
    add_column :offers, :discount_target_selection, :string
    add_column :offers, :discount_allocation_method, :string
    add_column :offers, :discount_prerequisite_quantity, :integer
    add_column :offers, :discount_shopify_id, :bigint
    add_column :offers, :discount_once_per_customer, :boolean
    add_column :offers, :discount_shopify_pricerule_id, :bigint
  end
end
