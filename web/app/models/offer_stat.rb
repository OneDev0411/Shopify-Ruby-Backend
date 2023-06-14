# frozen_string_literal: true
# coding: utf-8

# == Schema Information
#
# Table name: offer_stats
#
#  id         :integer          not null, primary key
#  action     :string
#  place      :integer
#  test_ab    :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  offer_id   :integer          not null
#  variant_id :integer
#
# Indexes
#
#  index_offer_stats_on_offer_id  (offer_id)
#
# Foreign Keys
#
#  fk_rails_...  (offer_id => offers.id)
#

class OfferStat < ApplicationRecord

  belongs_to :offer, inverse_of: :offer_stats

  enum place: { cart: 1, ajax: 2, product: 3 }

  def self.create_offer_stat(new_stat)
    new_stat['place'] = 'ajax' unless %w{cart product}.include?(new_stat['place'])
    create(new_stat) rescue nil
  end
end
