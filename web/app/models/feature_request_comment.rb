# == Schema Information
#
# Table name: feature_request_comments
#
#  id                 :integer          not null, primary key
#  comment            :text
#  downvote           :integer
#  upvote             :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  feature_request_id :integer
#  shop_id            :integer
#

class FeatureRequestComment < ActiveRecord::Base
end
