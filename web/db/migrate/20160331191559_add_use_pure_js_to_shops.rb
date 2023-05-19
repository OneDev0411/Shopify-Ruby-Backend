class AddUsePureJsToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :use_pure_js, :boolean, null: false, default: false
  end
end
