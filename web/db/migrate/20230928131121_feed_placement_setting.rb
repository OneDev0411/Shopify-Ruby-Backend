class FeedPlacementSetting < ActiveRecord::Migration[7.0]
  def change
    Rake::Task['create_placement_setting:feed_placement_setting'].invoke
  end
end
