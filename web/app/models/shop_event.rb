# frozen_string_literal: true

class ShopEvent < ApplicationRecord
  belongs_to :shop

  after_create :send_notification_to_the_headquarters

  # Public. Duplicate some text an arbitrary number of times.
  #
  # Return. RequestObject.
  def send_notification_to_the_headquarters
    event = pick_event
    return if event.blank?

    url = 'https://ltvsaasgrowth.com/api/v1/event'
    opts = {
      token: '2fc40ca2afbac593b48e66c00ac196b5cdd84e9c',
      event: event,
      website: shop.shopify_domain,
      email: shop.email,
      time: DateTime.now.strftime("%d-%m-%Y %HH:%mm"),
      app_id: 767045
    }
    verify_response HTTParty.get(url, body: opts.to_json)
  end

  private

  # Private: Check succesfull response.
  #
  # http_consult  - HTTParty::Response.
  #
  # Return boolean.
  def verify_response(http_consult)
    if http_consult.response.code == '403'
      update_column :updated_at, 3.seconds.from_now.utc
    end
  end

  # Private. Select the event if exist.
  #
  # Return. String.
  def pick_event
    %w[installation uninstalled first_offer first_order first_pixel].select { |term| title.include? term }.join
  end
end
