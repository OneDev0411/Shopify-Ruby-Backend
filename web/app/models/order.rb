# frozen_string_literal: true

# We track a store's orders so that we can create the Autopilot model.
# When a store is installed, we run a batch job to get historical orders.
# After that, we receive order data via webhook.
class Order < ApplicationRecord
  belongs_to :shop

end



