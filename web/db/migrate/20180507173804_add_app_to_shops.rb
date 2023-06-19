class AddAppToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :app, :string, null: false, default: "incartupsell"
  end
end
