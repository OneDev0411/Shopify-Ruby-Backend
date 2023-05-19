# frozen_string_literal: true

class DropOnboardMessagingTable < ActiveRecord::Migration[5.2]
  def up
    drop_table :onboarding_messages
    drop_table :offer_clicks
    drop_table :offer_events
    drop_table :cart_types
    drop_table :native_stats
    drop_table :versions
    drop_table :users
    drop_table :variants
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
