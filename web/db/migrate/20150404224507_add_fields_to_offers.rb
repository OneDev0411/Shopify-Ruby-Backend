class AddFieldsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :offer_text, :text
    add_column :offers, :offer_cta, :string
    add_column :offers, :offer_css, :text
  end
end
