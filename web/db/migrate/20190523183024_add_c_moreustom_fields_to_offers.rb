class AddCMoreustomFieldsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :custom_field_2_name, :string
    add_column :offers, :custom_field_2_placeholder, :string
    add_column :offers, :custom_field_2_required, :boolean
    add_column :offers, :custom_field_3_name, :string
    add_column :offers, :custom_field_3_placeholder, :string
    add_column :offers, :custom_field_3_required, :boolean
  end
end
