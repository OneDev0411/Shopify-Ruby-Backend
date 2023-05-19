class AddReChargeOptionsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :interval_unit, :string
    add_column :offers, :interval_frequency, :integer
    add_column :offers, :recharge_subscription_id, :integer
    add_column :shops, :has_recharge, :boolean, null: false, default: false
  end
end
