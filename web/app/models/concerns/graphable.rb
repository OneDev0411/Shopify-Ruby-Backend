# frozen_string_literal: true

# Shop's methods related to stats, marketing and graphs.
module Graphable
  extend ActiveSupport::Concern

  # Public: Gather daily offer stats for each offer. See Wiki: Graphs-on-the-"Offers-Stats"-page
  #
  # text - ymd - The String with the date: "%Y-%-m-%-d": "2020-11-28".
  #
  # Returns boolean.
  def generate_daily_stats
    offers.each(&:save_daily_stats)

    update_column :stats_synced_at, Time.now.utc
  end

  # Public. DailyStat by day, zeros if not data on that day. We don't need offer's test_ab data here.
  #
  # Return multidimensional Array.
  def all_days_stat_summary
    report_dates.map do |ds_date|
      ds = daily_stats.where.not(offer_id: nil).where(for_date: ds_date).first
      {
        ds_date: ds_date,
        loads: ds&.times_loaded&.presence || 0,
        clicks: ds&.times_clicked.presence || 0,
        revenue: ds&.click_revenue.presence || 0,
        times_showed_product: ds&.times_showed_product.presence || 0,
        times_showed_cart: ds&.times_showed_cart.presence || 0,
        times_showed_popup: ds&.times_showed_popup.presence || 0,
        times_clicked_product: ds&.times_clicked_product.presence || 0,
        times_clicked_cart: ds&.times_clicked_cart.presence || 0,
        times_clicked_popup: ds&.times_clicked_popup.presence || 0
      }
    end
  end

  def has_stats?
    daily_stats.present? && daily_stats.sum(:times_loaded) > 0
  end

  # Public: Rebuild the stats for the shop.
  #
  # Returns Array object.
  def regenerate_stats
    report_dates.each do |one_day|
      generate_daily_stats(one_day.strftime('%Y-%-m-%-d'))
    end
  end

  def now_with_shop_zone
    Time.now.in_time_zone(store_time)
  end

  # Public. Define the time zone
  def store_time
    iana_timezone.presence || 'America/New_York'
  end

  # Public: Gather data from two weeks: current and last.
  #
  # Returns Hashmap.
  def recent_stats
    lasts = gather_recent_stats
    lasts.reduce(:merge)
  end

  def setup_autopilot_first_time(jid)
    fetch_data_on_companions
    check_offerable_inventory
    auto_offer
    pj = pending_jobs.where(sidekiq_id: jid).first
    pj&.destroy
  end

  # Public. Reorder offers.
  #
  # offers_ids - Array of integers.
  #
  # Return. Void.
  def reorder_batch_offers(offers_ids)
    current_offers = offers.where(id: offers_ids).pluck(:position_order)

    offers_ids.each_with_index do |offer_id, index|
      offer = offers.find(offer_id)
      new_position = current_offers[index]

      next if new_position == offer.position_order

      offer.update_column :position_order, new_position
    end
  end

  def sale_stats
    offer_sale_weekly_value = []
    offer_sale_daily_value = []
    offer_sale_weekly_diff = []
    offer_sale_monthly_value = []
    offer_sale_yearly_value = []
    offer_sale_revenue = []
    offers.includes(:offer_events).each do |offer|
      offer_sale_weekly_value << offer.offer_events.where('action = ? and created_at >=?', "sale", (DateTime.now - 7.days)).sum(:amount)
      offer_sale_daily_value << offer.offer_events.where('action = ? and created_at >= ? and created_at <= ? ', "sale", DateTime.now.beginning_of_day, DateTime.now).sum(:amount)
      offer_sale_monthly_value << offer.offer_events.where('action = ? and created_at >=?', "sale", (DateTime.now - 30.days)).sum(:amount)
      offer_sale_yearly_value << offer.offer_events.where('action = ? and created_at >=?', "sale", (DateTime.now - 365.days)).sum(:amount)
      offer_sale_revenue << offer.offer_events.where(action: "sale").sum(:amount)
      offer_sale_weekly_diff << offer.offer_events.where(action: "sale").where(last_weeks_range(false)).sum(:amount)
    end
    diff = difference_between_weeks(offer_sale_weekly_value.sum, offer_sale_weekly_diff.sum)
    { "offer_sale_weekly_value": offer_sale_weekly_value.sum, "offer_sale_weekly_diff": diff, "offer_sale_daily_value": offer_sale_daily_value.sum, 
      "offer_sale_monthly_value": offer_sale_monthly_value.sum, "offer_sale_yearly_value": offer_sale_yearly_value.sum, "offer_sale_revenue":  offer_sale_revenue.sum}
  end

  private

  # Private. Gather:
  #   All Time Revenue and diff from last and current week
  #   Times loaded and diff from last and current week
  #   Clicks and diff from last and current week
  #
  # Returns Array of hashes.
  def gather_recent_stats
    [:click_revenue, :times_loaded, :times_clicked].map do |field|
      total        = daily_stats.sum(field)
      current_week = daily_stats.where(last_weeks_range).sum(field)
      last_week    = daily_stats.where(last_weeks_range(false)).sum(field)
      diff         = difference_between_weeks(current_week, last_week)
      { "#{field}_total": total, "#{field}_diff": diff }
    end
  end

  # Private: calculate percentage difference between current week vs last week.
  #
  # current_week - float.
  # last_week - float.
  #
  # Returns float.
  def difference_between_weeks(current_week, last_week)
    return 0.0 if last_week.zero?
    return 0.0 if current_week.zero?

    100*(current_week - last_week)/last_week
  end

  # Private: Build dates: 0-7 (current week) or 7-14 (past week) days.
  #
  # current_week  - boolean.
  #
  # Returns hashmap.
  def last_weeks_range(current_week=true)
    seven_dabd = 7.days.ago.beginning_of_day
    range = current_week ? seven_dabd..1.hour.ago : 14.days.ago.beginning_of_day..seven_dabd
    { created_at: range }
  end

  # Private. Create a range of days since created_at until today.
  #
  # Return. Range object.
  def report_dates
    @report_dates ||= (created_at.in_time_zone(iana_timezone).to_date)..
                      (Time.now.in_time_zone(iana_timezone).to_date)
  end
end

