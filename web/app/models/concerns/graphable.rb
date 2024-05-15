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
  def sales_stats(period, mode)
    $redis_stats_cache.hget("use:cache:#{self.id}", 'analytics') == '1' ? cached_sales_stats(period) : db_sales_stats(period)
  end
  
  def upsells_stats(period, mode)
     $redis_stats_cache.hget("use:cache:#{self.id}", 'analytics') == '1' ? cached_upsells_stats(period) : db_upsells_stats(period)
  end

  def clicks_stats(period, mode)
    $redis_stats_cache.hget("use:cache:#{self.id}", 'analytics') == '1' ? cached_clicks_stats(period) : db_clicks_stats(period)
  end

  def orders_stats(period, mode)
    $redis_stats_cache.hget("use:cache:#{self.id}", 'analytics') == '1' ? cached_orders_stats(period) : db_orders_stats(period)
  end

  # Get stats data for times_loaded
  def offers_stats_times_loaded(period, mode)
    $redis_stats_cache.hget("use:cache:#{self.id}", 'analytics') == '1' ? cached_offers_stats_times_loaded(period) : db_offers_stats_times_loaded(period)
  end

  # Get stats data for times_clicked
  def offers_stats_times_clicked(period, mode)
    $redis_stats_cache.hget("use:cache:#{self.id}", 'analytics') == '1' ? cached_offers_stats_times_clicked(period) : db_offers_stats_times_clicked(period)
  end

  # Get stats data for times_checkedout
  def offers_stats_times_checkedout(period, mode)
    $redis_stats_cache.hget("use:cache:#{self.id}", 'analytics') == '1' ? cached_offers_stats_times_checkedout(period) : db_offers_stats_times_checkedout(period)
  end

  # Get stats data for times_converted
  def offers_stats_times_converted(period, mode)
    $redis_stats_cache.hget("use:cache:#{self.id}", 'analytics') == '1' ? cached_offers_stats_times_converted(period) : db_offers_stats_times_converted(period)
  end

  # Get stats data for click_revenue
  def offers_stats_click_revenue(period)
    calculate_offer_stat(period, :click_revenue)
  end

  # Calculate stat data for each kind of stat
  def calculate_offer_stat(period, stat_field)
    start_date, end_date = self.period_to_date_range(period).values_at(:start_date, :end_date)

    # Fetch the sum of stat_field for the entire period in one query
    total_stat = DailyStat.where(shop_id: self.id).where('created_at >= ? and created_at <= ?', start_date, end_date).sum(stat_field)
  
    total_stat
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
    [:click_revenue, :times_loaded, :times_clicked, :times_checkedout].map do |field|
      total        = daily_stats.sum(field)
      current_week = daily_stats.where(last_weeks_range).sum(field)
      last_week    = daily_stats.where(last_weeks_range(false)).sum(field)
      diff         = difference_between_weeks(current_week, last_week)
      { "#{field}_total": total, "#{field}_diff": diff }
    end
  end

  def db_sales_stats(period)
    start_date, end_date = self.period_to_date_range(period).values_at(:start_date, :end_date)

    grouped_events = {}
    OfferEvent.where(action: 'sale', created_at: start_date..end_date)
      .joins(:offer)
      .where(offers: { shop_id: self.id })
      .group("date_trunc('#{period_trunc(period)}', offer_events.created_at)")
      .order(Arel.sql("date_trunc('#{period_trunc(period)}', offer_events.created_at) DESC"))
      .select("date_trunc('#{period_trunc(period)}', offer_events.created_at) as date, SUM(COALESCE((offer_events.payload->'calculated_total')::float, 0)) as total")
      .each do |event, hash|
        grouped_events[event.date.to_datetime] = event.total
      end
    
    date_intervals(start_date, end_date, period).each do |date|
      grouped_events[date] ||= 0
    end
    
    results = grouped_events.sort_by { |key, value| key }.map do |date, count|
      {
        key: format_label_for_period(date, period),
        value: count
      }
    end

    { results: results, sales_total: results.sum { |r| r[:value] } }
  end

  def db_upsells_stats(period)
    start_date, end_date = self.period_to_date_range(period).values_at(:start_date, :end_date)

    grouped_events = {}
    OfferEvent.where(action: 'sale', created_at: start_date..end_date)
      .joins(:offer)
      .where(offers: { shop_id: self.id })
      .group("date_trunc('#{period_trunc(period)}', offer_events.created_at)")
      .order(Arel.sql("date_trunc('#{period_trunc(period)}', offer_events.created_at) DESC"))
      .select("date_trunc('#{period_trunc(period)}', offer_events.created_at) as date, sum(amount) as total")
      .each do |event, hash|
        grouped_events[event.date.to_datetime] = event.total
      end

    date_intervals(start_date, end_date, period).each do |date|
      grouped_events[date] ||= 0
    end
    
    results = grouped_events.sort_by { |key, value| key }.map do |date, count|
      {
        key: format_label_for_period(date, period),
        value: count
      }
    end
  
    { results: results, upsells_total: results.sum { |r| r[:value] } }
  end

  def db_orders_stats(period)
    start_date, end_date = self.period_to_date_range(period).values_at(:start_date, :end_date)
  
    grouped_orders = Order.where(shop_id: self.id, created_at: start_date..end_date)
      .group("date_trunc('#{period_trunc(period)}', created_at)")
      .order(Arel.sql("date_trunc('#{period_trunc(period)}', created_at) DESC"))
      .count
      .each_with_object({}) { |(date, count), object| object[date.to_datetime] = count }
  
    date_intervals(start_date, end_date, period).each do |date|
      grouped_orders[date] ||= 0
    end

    results = grouped_orders.sort_by { |key, value| key }.map do |date, count|
      {
        key: format_label_for_period(date, period),
        value: count
      }
    end
  
    { results: results, orders_total: results.sum { |r| r[:value] } }
  end

  def db_clicks_stats(period)
    start_date, end_date = self.period_to_date_range(period).values_at(:start_date, :end_date)

    grouped_clicks = OfferEvent.where(action: 'click', created_at: start_date..end_date)
      .joins(offer: :shop)
      .where(shop: { id: self.id })
      .group("date_trunc('#{period_trunc(period)}', offer_events.created_at)")
      .order(Arel.sql("date_trunc('#{period_trunc(period)}', offer_events.created_at) DESC"))
      .count
      .each_with_object({}) { |(date, count), object| object[date.to_datetime] = count }

    date_intervals(start_date, end_date, period).each do |date|
      grouped_clicks[date] ||= 0
    end
    
    results = grouped_clicks.sort_by { |key, value| key }.map do |date, count|
      {
        key: format_label_for_period(date, period),
        value: count
      }
    end
  
    { results: results, clicks_total: results.sum { |r| r[:value] } }
  end

  # Get stats data for click_revenue
  def db_offers_stats_click_revenue(period)
    calculate_offer_stat(period, :click_revenue)
  end

  # Get stats data for times_loaded
  def db_offers_stats_times_loaded(period)
    start_date, end_date = self.period_to_date_range(period).values_at(:start_date, :end_date)

    total_stat = OfferStat.where(action: 'show', created_at: start_date..end_date)
      .joins(:offer)
      .where(offers: { shop_id: self.id })
      .count

    return total_stat
  end

  # Get stats data for times_clicked
  def db_offers_stats_times_clicked(period)
    start_date, end_date = self.period_to_date_range(period).values_at(:start_date, :end_date)

    total_stat = OfferEvent.where(action: 'click', created_at: start_date..end_date)
      .joins(:offer)
      .where(offers: { shop_id: self.id })
      .count

    return total_stat
  end

  # Get stats data for times_checkedout
  def db_offers_stats_times_checkedout(period)
    start_date, end_date = self.period_to_date_range(period).values_at(:start_date, :end_date)

    total_stat = OfferStat.where(action: 'checkout', created_at: start_date..end_date)
      .joins(:offer)
      .where(offers: { shop_id: self.id })
      .count

    return total_stat
  end

  # Get stats data for times_converted
  def db_offers_stats_times_converted(period)
    start_date, end_date = self.period_to_date_range(period).values_at(:start_date, :end_date)

    total_stat = OfferEvent.where(action: 'sale', created_at: start_date..end_date)
      .joins(:offer)
      .where(offers: { shop_id: self.id })
      .distinct
      .count(:cart_token)

    return total_stat
  end

  # Calculate stat data for each kind of stat
  def db_calculate_offer_stat(period, stat_field)
    start_date, end_date = self.period_to_date_range(period).values_at(:start_date, :end_date)

    # Fetch the sum of stat_field for the entire period in one query
    total_stat = DailyStat.where(shop_id: self.id).where('created_at >= ? and created_at <= ?', start_date, end_date).sum(stat_field)
  
    total_stat
  end

  def cached_sales_stats(period)
    results = self.fetch_data_from_redis(['shop:sale:total'], period)
    { results: results['shop:sale:total'], sales_total: results['shop:sale:total'].sum { |r| r[:value] } }
  end
  
  def cached_upsells_stats(period)
    results = self.fetch_data_from_redis(['shop:sale:upsell'], period)    
    { results: results['shop:sale:upsell'], upsells_total: results['shop:sale:upsell'].sum { |r| r[:value] } }
  end

  def cached_clicks_stats(period)
    results = self.fetch_data_from_redis(['shop:click:count'], period)
    { results: results['shop:click:count'], clicks_total: results['shop:click:count'].sum { |r| r[:value] } }
  end

  def cached_orders_stats(period)
    results = self.fetch_data_from_redis(['shop:order:count'], period)
    { results: results['shop:order:count'], orders_total: results['shop:order:count'].sum { |r| r[:value] } }
  end

  # Get stats data for times_loaded
  def cached_offers_stats_times_loaded(period)
    results = self.fetch_data_from_redis(['shop:show:count'], period)
    results['shop:show:count'].sum { |r| r[:value] }
  end

  # Get stats data for times_clicked
  def cached_offers_stats_times_clicked(period)
    results = self.fetch_data_from_redis(['shop:click:count'], period)
    results['shop:click:count'].sum { |r| r[:value] }
  end

  # Get stats data for times_checkedout
  def cached_offers_stats_times_checkedout(period)
    results = self.fetch_data_from_redis(['shop:checkout:count'], period)
    results['shop:checkout:count'].sum { |r| r[:value] }
  end

  # Get stats data for times_converted
  def cached_offers_stats_times_converted(period)
    results = self.fetch_data_from_redis(['shop:sale:count'], period)
    results['shop:sale:count'].sum { |r| r[:value] }
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
