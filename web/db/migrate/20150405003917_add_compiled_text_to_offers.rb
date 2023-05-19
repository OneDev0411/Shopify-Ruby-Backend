class AddCompiledTextToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :compiled_offer_text, :text
  end
end
