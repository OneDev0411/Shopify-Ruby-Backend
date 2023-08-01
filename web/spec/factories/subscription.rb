# frozen_string_literal: true

# == Schema Information
#
# Table name: subscriptions
#
#  id                    :integer          not null, primary key
#  advanced_stats        :boolean
#  bill_on               :date
#  discount_percent      :integer
#  extra_trial_days      :integer          default(0), not null
#  has_ab_testing        :boolean
#  has_ajax_cart         :boolean
#  has_branding          :boolean
#  has_customer_tags     :boolean
#  has_discounts         :boolean          default(FALSE), not null
#  has_match_options     :boolean
#  offers_limit          :integer
#  platform              :string
#  price_in_cents        :integer
#  shopify_charge_id_bak :bigint
#  status                :string
#  stripe_customer_token :string
#  stripe_email          :string
#  stripe_token          :string
#  trial_ends_at         :datetime
#  views_limit           :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  plan_id               :integer
#  shop_id               :integer
#  shopify_charge_id     :bigint
#
# Indexes
#
#  index_subscriptions_on_plan_id  (plan_id)
#  index_subscriptions_on_shop_id  (shop_id)
#
# Foreign Keys
#
#  fk_rails_...  (plan_id => plans.id)
#  fk_rails_...  (shop_id => shops.id)
#


FactoryBot.define do
  factory :subscription do
    association         :shop
    association         :plan
    price_in_cents      { 2000 }
    offers_limit        { 10000 }
    views_limit         { 10000 }
    advanced_stats      { true }
    status              { 'approved' }
    shopify_charge_id   { 17169350811 }
    has_ajax_cart       { true }
    has_customer_tags   { true }
    has_ab_testing      { true }
    has_branding        { true }
    extra_trial_days    { 0 }
    trial_ends_at       { 1.month.from_now }
    has_match_options   { false }
    has_discounts       { false }
  end

  trait :trial_status do
    shopify_charge_id { nil }
  end
  trait :in_the_future do
    created_at { 2.days.from_now }
  end
end
