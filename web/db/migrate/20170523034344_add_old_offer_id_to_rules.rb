class AddOldOfferIdToRules < ActiveRecord::Migration[5.2]
  def change
    add_column :rules, :old_offer_id, :int
  end
end
