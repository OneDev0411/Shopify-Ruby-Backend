class Session < ApplicationRecord
  validates :session_id, uniqueness: true
  validates :shop_domain, :access_token, :state, presence: true
end
