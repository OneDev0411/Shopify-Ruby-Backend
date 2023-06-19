# frozen_string_literal: true

class RevenueSnapshot < ApplicationRecord
  # This model is used in scheduler.rake, where we create a daily report

  # Public Class. Build revenue data by range of dates.
  #
  # date_min  - String. Starting date.
  # date_max  - String. Ending date.
  #
  # Returns Hashmap.
  def self.recurring_revenue_by_range_of_dates(date_min, date_max)
    by_days = revenue_by_days(date_min, date_max)
    {
      current_time_stamp: DateTime.now.to_time.to_i,
      current_date: DateTime.now.strftime('%d-%m-%Y')
    }.merge by_days
  end

  # Private Class. Build main data structure.
  def self.revenue_by_days(date_min, date_max)
    days_range    = build_range_date(date_min, date_max)
    days_revenue  = where(created_at: days_range).to_a
    summed_fields = sum_fields(days_revenue)
    plans_by_day  = days_revenue.map { |dr| dr.bucket_data.dig('flex_detail') }

    summed_fields.merge plans: revenue_by_plan(plans_by_day)
  end

  # Private Class. Sum requested fields and add annual revenue.
  def self.sum_fields(days_revenue)
    allfields = requested_report_fields.map do |k, v|
      { k => days_revenue.sum { |dr| dr.try(v) } }
    end
    allfields << { paying_arr: UsageCharge.last_year_revenue }
    formatted_amounts allfields.reduce(&:merge)
  end

  # Private Class. From cents to dollars.
  def self.formatted_amounts(fields)
    keywords = %i[paying_mrr trial_mrr paying_arr]
    fields.map do |k, v|
      value = keywords.include?(k) ? to_dollars(v) : v
      { k => value }
    end.reduce(&:merge)
  end

  # Private Class. Map requested fields with Database fields
  def self.requested_report_fields
    { paying_mrr: :subscription_amount_in_cents,
      trial_mrr: :trial_amount_in_cents,
      subscription_count: :subscription_count,
      trial_count: :trial_count }
  end

  # Private Class.
  def self.to_dollars(cents)
    (cents / 100).to_f.round(2)
  end

  # Public Class. Build the final data structure for each plan.
  #
  # plans_by_day - Array. Days searched.
  #
  # Return. Array of Hashes.
  def self.revenue_by_plan(plans_by_day)
    trial_mrr = build_trials_mrr(plans_by_day)
    reformat_data_structure(plans_by_day).group_by { |p| p[:plan] }.map do |k, v|
      { id: 19, name: k, price: v.first[:price], mrr_paying: sum_cases(v),
        number_of_users: v.map { |r| r[:amount]}.sum, mrr_trial: sum_cases(trial_mrr[k]) }
    end
  end

  def self.sum_cases(plans)
    begin
      plans.map { |r| r[:revenue] }.sum.round(2)
    rescue NoMethodError => e
      Rails.logger.debug "sum_cases >>  #{e.inspect}"
      0.0
    end
  end

  def self.build_trials_mrr(plans_by_day)
    plans_by_day.map do |plan_day|
      plan_day['trial'].map do |trial_plans|
        trial_plans.map do |k,v|
          price = monthly_price[k]
          next if price.blank?

          revenue = price * v
          { plan: k, price: price, amount: v, revenue: revenue }
        end
      end.flatten
    end&.first&.group_by { |p| p[:plan] }
  end

  # Public Class. Reorder data structure for paid array.
  #
  # plans_by_day - Array with days.
  #
  # Return. Array.
  def self.reformat_data_structure(plans_by_day)
    plans_by_day.map do |plan_day|
      plan_day['active'].map do |k, v|
        price = monthly_price[k]
        next if price.nil?

        revenue = price * v
        { plan: k, price: price, amount: v, revenue: revenue }
      end
    end.flatten
  end

  def self.monthly_price
    @monthly_price ||= Subscription.usage_charge_schedule[:monthly_price]
  end

  # Public Class. Last data from revenue.
  #
  # Return Array.
  def self.last_three_months
    where('created_at > ?', 90.days.ago).order(:created_at).map do |e|
      [e.created_at.strftime('%s000'), e.subscription_amount_in_cents, e.trial_amount_in_cents]
    end
  end

  def self.current_active_plans(date_min, date_max)
    Plan.active.map do |plan|
      shops_by_plan = plan.shops_and_totals_by_plan(date_min, date_max)
      {
        id: plan.id,
        name: plan.name,
        price: plan.price_in_dollars,
        number_of_users: shops_by_plan[:total_active],
        mrr_paying: shops_by_plan[:total_revenue_paying],
        mrr_trial: shops_by_plan[:total_revenue_trial]
      }
    end
  end

  private

  # Private class. Gathers Subscription data grouped by current kind of Plan.
  #
  # arrgs - Array.
  #
  # Return. Range object.
  def self.build_range_date(*arrgs)
    query_dates = arrgs.map do |query_date|
      begin
        DateTime.strptime(query_date, '%d-%m-%Y').utc
      rescue ArgumentError, TypeError
        DateTime.now.utc
      end
    end

    query_dates.first.beginning_of_day..query_dates.second.end_of_day
  end

  # Private. Consult subscriptions by range of day.
  #
  # arr  - Array.
  #
  # Return ActiveRecord object.
  def self.consult_subscriptions(*arr)
    dates = arr.map do |query_date|
      begin
        DateTime.strptime(query_date, '%d-%m-%Y')
      rescue ArgumentError
        DateTime.now
      end
    end
    Subscription.active_paying_shops
                .where(created_at: dates.first.beginning_of_day..dates.second.end_of_day)
  end

  def self.shop_recurring_charge(shop)
    begin
      shop.activate_session
      ShopifyAPI::RecurringApplicationCharge.find(id: shop.subscription.shopify_charge_id)
    rescue StandardError => e
      Rails.logger.debug "RecurringApplicationCharge #{e.message}"
    end
  end

  private_class_method :shop_recurring_charge, :consult_subscriptions

end

