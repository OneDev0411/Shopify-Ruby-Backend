class AddCustomFieldsToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :show_custom_field, :boolean
    add_column :offers, :custom_field_name, :string
    add_column :offers, :custom_field_placeholder, :string
  end
end
