# frozen_string_literal: true

class DiscountShop < ApplicationRecord
  belongs_to :marketing
  belongs_to :shop
end
