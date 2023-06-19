# == Schema Information
#
# Table name: feature_requests
#
#  id          :integer          not null, primary key
#  description :text
#  downvotes   :integer
#  title       :string
#  upvotes     :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  shop_id     :integer
#

class FeatureRequest < ActiveRecord::Base
end
