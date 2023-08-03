# This file should contain all the record creation needed to seed the database with its default values.

unless Rails.env.production?
  plans = [
    {name: 'Free', values: {price_in_cents: 0, offers_limit:	1, views_limit:	0,
    advanced_stats: false, active:	true, has_ajax_cart:	true, has_customer_tags: true,
    has_ab_testing: false, has_branding:	true, has_offers_in_checkout: false, has_geo_offers:	false,
    has_remove_offers: false, has_autopilot: false, internal_name: 'free_plan'}},
    {name: 'FLEX', values: {price_in_cents: 0, offers_limit:	500, views_limit:	0,
    advanced_stats: true, active:	true, has_ajax_cart:	true, has_customer_tags:	true, has_ab_testing: false,
    has_branding: false, has_offers_in_checkout: true, has_geo_offers: true, has_remove_offers: true,
    has_autopilot: false, internal_name: 'plan_based_billing'}},
    {name: 'DEVELOPMENT', values: {price_in_cents: 0, offers_limit: 500,
    views_limit: 0, advanced_stats: true, active: true, has_ajax_cart: true, has_customer_tags: true,
    has_ab_testing:	false, has_branding: false, has_offers_in_checkout: true, has_geo_offers: true,
    has_remove_offers: true, has_autopilot: true, internal_name: 'development'}},
    {
      name: "TRIAL", values: {
        price_in_cents: 0,
        offers_limit: 500,
        views_limit: 0,
        advanced_stats: true,
        active: true,
        has_ajax_cart: nil,
        has_customer_tags: true,
        has_ab_testing: false,
        has_branding: false,
        has_offers_in_checkout: false,
        has_geo_offers: true,
        has_remove_offers: true,
        has_autopilot: true,
        stripe_id: nil,
        internal_name: "trial_plan"
      }
    }
  ]

  plans.each do |pln|
    Plan.find_or_initialize_by(name: pln[:name]).update!(pln[:values])
  end
end
