class AddStatsFieldsToOffers < ActiveRecord::Migration[7.0]
  def up
    add_column :offers, :total_clicks, :bigint, default: 0, null: false
    add_column :offers, :total_views, :bigint, default: 0, null: false
    add_column :offers, :total_revenue, :bigint, default: 0, null: false
  end

  def down
    remove_column :offers, :total_clicks
    remove_column :offers, :total_views
    remove_column :offers, :total_revenue
  end
end