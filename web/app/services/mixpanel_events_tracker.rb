class MixpanelEventsTracker

  def track_shop_event(shop, event_title)
    $mixpanel_tracker.track(shop.shopify_id, event_title, {
      'Name': shop.name,
      'Shopify domain': shop.shopify_domain,
      'Email': shop.email,
    })
  end

  def track_plan_update_event(shopify_id, event_title, plan)
    $mixpanel_tracker.track(shopify_id, event_title, {
      'Plan name': plan.name, 
      'Plan offers limit': plan.offers_limit,
      'Plan price in cents': plan.price_in_cents,
      'Plan views limit': plan.views_limit
    })
  end

  def add_user(shop)
    $mixpanel_tracker.people.set(shop.shopify_id, JSON.parse(shop.to_json));
    $mixpanel_tracker.people.set(shop.shopify_id, "$email": shop.email);
  end
end
