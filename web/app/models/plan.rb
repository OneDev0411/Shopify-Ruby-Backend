# frozen_string_literal: true

# A Plan is what a merchant subscribes to with a subscription.  Ie.
# a Shopify merchant chooses a plan when they install the app, and
# the ID of that plan is associated with their subscription
class Plan < ApplicationRecord

  has_many :subscriptions
  has_many :shops, through: :subscriptions

  def price_in_dollars
    price_in_cents / 100.0
  end

  def requires_payment?
    price_in_cents.positive? || internal_name == 'plan_based_billing'
  end

  def self.active
    where(active: true)
  end

  def self.without_enterprise
    where("name != 'Enterprise'").where("name != 'CHECKOUT'")
  end

  def flex_plan?
    internal_name=="plan_based_billing"
  end

  def free_plan?
    internal_name == "free_plan"
  end

  # Public Class Method.
  # TODO: in the future, only 'plan_based_billing' aka (FLEX plan)
  def self.paid_plan_ids
    where("price_in_cents != 0 OR internal_name = 'plan_based_billing'").map(&:id)
  end

  private

    # Private. Find paying and trial shops for a specific plan.
    #
    # Return hashmap.
    def shops_by_plan(date_range)
      active_paying_shops = subscriptions.active_paying_shops.where(created_at: date_range)&.count
      active_trial_shops  = subscriptions.active_trial_shops.where(created_at: date_range)&.count
      total_active        = active_paying_shops + active_trial_shops
      { active_paying_shops: active_paying_shops,
        active_trial_shops: active_trial_shops,
        total_active: total_active }
    end
end
