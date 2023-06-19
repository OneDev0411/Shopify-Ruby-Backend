class ChangeExcludedTagsToString < ActiveRecord::Migration[5.2]
  def up
    change_column :offers, :excluded_tags, :string
  end

  def down
    change_column :offers, :excluded_tags, :jsonb
  end
end
