# frozen_string_literal: true

# A DailyStat is a record of how many views and clicks an offer received
# on a particular day.  If the offer has an AB test, it also records the
# number of views and clicks each variation of it received. It also tracks the
# $ value of the products added to the cart by these clicks.
#
# We create a daily stat by rolling up the individual clicks and views from
# OfferStats model at the end of the day.
class DailyStat < ApplicationRecord
  belongs_to :offer
  belongs_to :shop

end
