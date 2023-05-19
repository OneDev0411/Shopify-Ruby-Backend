class AddScriptTagIdToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :script_tag_id, :bigint
  end
end
