class AddCartTokenToOfferStats < ActiveRecord::Migration[6.1]
  def up
    add_column :offer_stats, :cart_token, :string
    change_column :offer_stats, :variant_id, :bigint
    add_column :offer_stats, :sale_value, :float
  end

  def down
    change_column :offer_stats, :variant_id, :integer
    remove_column :offer_stats, :cart_token, :string
    remove_column :offer_stats, :sale_value, :integer
  end
end
