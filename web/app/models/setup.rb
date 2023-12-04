# frozen_string_literal: true
# == Schema Information
#
# Table name: setups
#
#  id         :integer          not null, primary key
#  details    :jsonb
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  shop_id    :integer
#
# Indexes
#
#  index_setups_on_shop_id  (shop_id)
#
# Foreign Keys
#
#  fk_rails_...  (shop_id => shops.id)
#

class Setup < ApplicationRecord
  belongs_to :shop
end
