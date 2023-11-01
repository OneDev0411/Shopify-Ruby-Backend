# frozen_string_literal: true
# coding: utf-8

# == Schema Information
#
# Table name: offer_events
#
#  id               :integer          not null, primary key
#  action           :string
#  offer_id         :integer
#  variant_id       :string
#  payload          :jsonb
#  cart_token       :string
#  created_at       :datetime         
#  updated_at       :datetime         
#
# Indexes
#
#  (offer_id)
#
# Foreign Keys
#
#  fk_rails_...  (offer_id => offers.id)
#

class OfferEvent < ApplicationRecord

  belongs_to :offer, inverse_of: :offer_events

  scope :sales_within_given_range, ->(start_date, end_date, shop_id) {
    where(action: 'sale', created_at: start_date.beginning_of_day..end_date.end_of_day)
    .joins(offer: :shop)
    .where(shop: { id: shop_id })
  }

  def self.create_offer_event(new_event)
    new_event = eval(new_event)
    new_event = { offer_id: new_event['offerId'],
                 action: new_event['action'],
                 cart_token: new_event['cart_token'],
                 variant_id: new_event['selectedShopifyVariant'] }
    create(new_event) rescue nil
  end


  def self.create_offer_sale_stat(order_data)
    return if order_data["cart_token"].nil?
    stats = OfferEvent.where(cart_token: order_data["cart_token"], action: 'click')
    return unless stats.present?
    
    check_and_create_stats(stats, order_data)
  end

  def self.check_and_create_stats(stats, order_data)
    order_data["item_variants"].each do |v|
      v_stats = stats.where(variant_id: v["variant_id"].to_s)
      next unless v_stats.present?
      
      discount = '0.0'
      discount = eval(v['discount'][0])['amount'] if v['discount'].present?
      sale_value = (v['price'].to_f  - discount.to_f )* v_stats.count
      v_stats = v_stats.last
      OfferEvent.find_or_create_by(offer_id: v_stats.offer_id, 
                                  variant_id: v_stats.variant_id,
                                  cart_token: v_stats.cart_token,
                                  action: 'sale',
                                  payload: order_data,
                                  amount: sale_value)
    end
  end

  def self.destroy_click_events
    events = OfferEvent.where(action: 'click').delete_all
  end
end
