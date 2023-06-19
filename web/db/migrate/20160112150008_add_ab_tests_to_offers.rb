class AddAbTestsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :offer_text_alt, :text
    add_column :offers, :offer_cta_alt, :text
    add_column :offers, :compiled_offer_text_alt, :text
  end
end
