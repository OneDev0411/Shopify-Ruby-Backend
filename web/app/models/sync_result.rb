# frozen_string_literal: true

# We periodically (once per day per shop, in a scheduled task) track
# the details of each offered collection and product.  This is probably
# overkill, but the results are stored in these objects and you can reference them
# on a per-shop basis

class SyncResult < ApplicationRecord
  belongs_to :shop

end