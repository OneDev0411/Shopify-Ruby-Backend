# == Schema Information
#
# Table name: marketings
#
#  id            :integer          not null, primary key
#  code          :string           not null
#  discount      :integer          default(0)
#  discount_type :integer          default(0), not null
#  expires       :datetime
#  is_targeted   :boolean          default(FALSE)
#  usage_counter :integer          default(0)
#  usage_limit   :integer          default(0), not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_marketings_on_code           (code) UNIQUE
#  index_marketings_on_discount_type  (discount_type)
#

class Marketing < ActiveRecord::Base
  enum discount_type: [:percentage, :extned_trial_days]
  has_many :targets, class_name: 'MarketingTarget'
  has_many :discount_shops
  validates_uniqueness_of :code, allow_blank: false

  before_save :sanitize_code

  private
  def sanitize_code
    self.code = self.code.gsub(' ', '-')
  end
end
