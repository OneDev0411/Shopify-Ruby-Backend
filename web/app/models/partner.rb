# == Schema Information
#
# Table name: partners
#
#  id          :integer          not null, primary key
#  app_url     :string           not null
#  description :text             not null
#  image       :string           not null
#  name        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_partners_on_app_url      (app_url) UNIQUE
#  index_partners_on_description  (description) UNIQUE
#  index_partners_on_name         (name) UNIQUE
#

class Partner < ActiveRecord::Base
  validates :name, :app_url, :image, :description, presence: true
  validates :name, :app_url, :image, uniqueness: true
end
