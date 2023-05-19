# == Schema Information
#
# Table name: marketing_targets
#
#  id           :integer          not null, primary key
#  email        :string           not null
#  has_accepted :boolean          default(FALSE)
#  is_invited   :boolean          default(FALSE)
#  secret_code  :string           not null
#  store_url    :string
#  marketing_id :integer          not null
#
# Indexes
#
#  index_marketing_targets_on_email                   (email)
#  index_marketing_targets_on_marketing_id_and_email  (marketing_id,email) UNIQUE
#

class MarketingTarget < ActiveRecord::Base
  belongs_to :marketing
end
