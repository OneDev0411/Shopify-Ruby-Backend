class IntercomEventsTracker

  def install_event(shop, event_title)
    begin
      body = base_event(shop)
      body["event_name"] = "#{event_title}_date"
      body = body.to_json
      HTTParty.post(base_url, body: body, headers: headers)
    rescue StandardError => e
      Rails.logger.debug "## Error creating intercom install event >>> #{e.inspect}"
      ErrorNotifier.call(e)
    end
  end

  def uninstall_event(shop)
    begin
      body = base_event(shop)
      body["created_at"] = shop.uninstalled_at.to_i
      body["event_name"] = "uninstall_date"
      body = body.to_json
      HTTParty.post(base_url, body: body, headers: headers)
    rescue StandardError => e
      Rails.logger.debug "## Error creating intercom install event >>> #{e.inspect}"
      ErrorNotifier.call(e)
    end
  end

  private

  def base_url
    "https://api.intercom.io/events"
  end

  def headers
    token = ENV['INTERCOM_API_KEY']
    {
      "Authorization" => "Bearer #{token}",
      "Content-Type" => "application/json",
      "Intercom-Version" => "2.10"
    }
  end

  def base_event(shop)
    {
      event_name: "",
      email: shop.email,
      created_at: Time.now.utc.to_i,
      metadata: {
        shop_id: shop.id,
        shopify_domain: shop.shopify_domain
      }
    }
  end
end