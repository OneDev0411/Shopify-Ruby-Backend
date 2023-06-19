class AddCompiledTextVersionsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :compiled_text_a, :text
    add_column :offers, :compiled_text_b, :text
  end
end
