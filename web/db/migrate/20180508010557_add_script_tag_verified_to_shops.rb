class AddScriptTagVerifiedToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :script_tag_verified_at, :datetime
  end
end
