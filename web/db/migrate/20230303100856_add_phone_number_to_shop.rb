class AddPhoneNumberToShop < ActiveRecord::Migration[6.1]
  def change
    add_column :shops, :phone_number, :string
  end
end
