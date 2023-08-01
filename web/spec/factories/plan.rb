# frozen_string_literal: true

FactoryBot.define do
  # wrap all specialized factories in this empty factory named after the class, so that we don't have to specify class: everywhere
  factory :plan do
    has_ajax_cart { true }
    has_customer_tags { true }
    has_ab_testing { true }
    has_geo_offers { true }
    has_branding { false }
    has_offers_in_checkout { false }
    has_remove_offers { true }
    has_autopilot { true }
    # Recurring Plans
    factory :enterprise_plan do
      name { 'Enterprise' }
      internal_name { '' }
      price_in_cents { 1190 }
      offers_limit	{ 1000 }
      views_limit { 0 }
      advanced_stats { true }
      active { true }
    end

    factory :flex_plan do
      name { 'FLEX' }
      internal_name { 'plan_based_billing' }
      price_in_cents { 1200 }
      offers_limit	{ 500 }
      views_limit { 0 }
      advanced_stats { true }
      active	{ true }
      has_ajax_cart { true }
      has_customer_tags	{ true }
      has_ab_testing { false }
      has_branding { false }
      has_offers_in_checkout { true }
      has_geo_offers { true }
      has_remove_offers { true }
      has_autopilot { false }
    end

    factory :professional_plan do
      name { 'Professional' }
      internal_name { 'professional' }
      price_in_cents { 4900 }
      offers_limit	{ 1000 }
      views_limit { 0 }
      advanced_stats { true }
      active { true }
    end

    factory :free_plan do
      name { 'Free' }
      internal_name { 'free_plan' }
      price_in_cents { 0 }
      offers_limit	{ 1 }
      views_limit	{ 0 }
      advanced_stats { false }
      active { true }
      has_ajax_cart	{ true}
      has_customer_tags { true}
      has_ab_testing { false}
      has_branding { true }
      has_offers_in_checkout { false }
      has_geo_offers { false }
      has_remove_offers { false }
      has_autopilot { false }
    end
  end
end
