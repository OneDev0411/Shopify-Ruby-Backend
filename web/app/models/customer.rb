class Customer < ApplicationRecord
  belongs_to :shop, optional: true
  validates :email, :shopify_domain, presence: true
end