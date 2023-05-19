class AddCustomFieldRequiredToOffers < ActiveRecord::Migration[5.2]
  def change
    add_column :offers, :custom_field_required, :boolean
  end
end
