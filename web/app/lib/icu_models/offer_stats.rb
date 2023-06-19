# coding: utf-8
# frozen_string_literal: true

module IcuModels
  module OfferStats

    def self.included(base)
      base.extend(ClassMethods)
    end

    module ClassMethods
      def initialize_method
      end
    end

    DATE_FORMAT = '%Y-%-m-%-d'

    # Public: method means to run at midnight to summary daily offer events (shows & clicks).
    #
    # Returns boolean or nil.
    def save_daily_stats
      begin
        query_date = build_query_date
        @offer_events = stats_by_the_day(query_date)
        return if @offer_events.blank?

        offer_stats = build_daily_stats.symbolize_keys
        @offer_events.delete_all if assign_data(offer_stats, query_date)
      rescue StandardError => e
        logger.debug "## Error collecting data: save_daily_stats >>> #{e.inspect}"
      end
    end

    private

    # Private. Choose OfferStat according to the Store's time zone
    def build_query_date
      Time.now.in_time_zone(store_time)
    end

    # Private. Defines shop's time zone
    def store_time
      shop.store_time
    end

    # Private. Gathers the data for one day
    # query_date - DateTime object
    # Returns. AR object.
    def stats_by_the_day(query_date)
      offer_stats.where(created_at: query_date.beginning_of_day..query_date.end_of_day)
    end

    # Private: Collect and merge data from OfferStats.
    #
    # Returns: One level Hash.
    def build_daily_stats
      grouped_offer_stats = group_stats_by(:action, :test_ab)
      [grouped_offer_stats, group_by_test_ab, group_by_action_place].reduce(:merge)
    end

    # Private. Groups stats by test_ab.
    def group_by_test_ab
      @offer_events.group_by { |e| [e.action, e.test_ab] }.reduce({}) do |acc, elm|
        elm.first.nil? ? acc : acc.merge({ elm.first.join => elm.second.count })
      end
    end

    # Private. Groups events (views & clicks) by the matrix of action-place.
    # Six possible combinations: view.product_page, view.cart, view.popup
    # click.product_page, click.cart, click.popup.
    def group_by_action_place
      @offer_events.group_by { |e| [e.action, e.place] }.reduce({}) do |acc, elm|
        elm.first.nil? ? acc : acc.merge({ elm.first.join => elm.second.count })
      end
    end

    # Private: Order OfferStats by different criteria.
    #
    # *args, keywords to be ordered
    #
    # Returns: One level Hash.
    def group_stats_by(*args)
      groups = args.map do |event_grouped_by|
        @offer_events.group_by(&event_grouped_by).reduce({}) do |acc, row|
          row.first.nil? ? acc : acc.merge({ row.first => row.second.count })
        end
      end
      groups.reduce(:merge)
    end

    # Private. Only one row of consolidated stats by day
    # Returns AR object
    def initialize_ds(query_date)
      DailyStat.find_or_initialize_by(offer_id: id, for_date: query_date, shop_id: shop.id)
    end

    # Public. Pass the data from the hash to the DailyStat model. TODO: create a method to make the
    # assignements automatic.
    #
    # offer_stats - hashmap of values.
    # query_date - Date object.
    #
    # Returns. boolean
    def assign_data(offer_stats, query_date)
      row_ds = initialize_ds(query_date)

      row_ds.times_loaded          += no_nil(offer_stats[:show])
      row_ds.times_clicked         += no_nil(offer_stats[:click])
      row_ds.times_orig_loaded     += no_nil(offer_stats[:showa])
      row_ds.times_orig_clicked    += no_nil(offer_stats[:clicka])
      row_ds.times_alt_loaded      += no_nil(offer_stats[:showb])
      row_ds.times_alt_clicked     += no_nil(offer_stats[:clickb])
      row_ds.times_showed_product  += no_nil(offer_stats[:showproduct])
      row_ds.times_showed_cart     += no_nil(offer_stats[:showcart])
      row_ds.times_showed_popup    += no_nil(offer_stats[:showajax])
      row_ds.times_clicked_product += no_nil(offer_stats[:clickproduct])
      row_ds.times_clicked_cart    += no_nil(offer_stats[:clickcart])
      row_ds.times_clicked_popup   += no_nil(offer_stats[:clickajax])

      click_revenue = calculate_revenue(offer_stats[:click])

      row_ds.click_revenue += no_nil(click_revenue)
      row_ds.save!
    end

    # Private. Matches the DailyStats model attributtes with the grouped result hash.
    #
    # Returns HashMap.
    def keyword_to_key
      { times_loaded: :show,
        times_clicked: :click,
        times_orig_loaded: :showa,
        times_orig_clicked: :clicka,
        times_alt_loaded: :showb,
        times_alt_clicked: :clickb,
        times_showed_product: :showproduct,
        times_showed_cart: :showcart,
        times_showed_popup: :showajax,
        times_clicked_product: :clickproduct,
        times_clicked_cart: :clickcart,
        times_clicked_popup: :clickajax }
    end

    def no_nil(value)
      (value || 0)
    end

    # Private. Estimates revenue multipling clicks by the average price
    # times_clicked - integer.
    # Returns integer.
    def calculate_revenue(times_clicked)
      return 0 unless times_clicked&.nonzero?

      prices = offer_prices.to_f
      prices.present? ? (prices * times_clicked) : 0
    end

    # Private: make the sum of the elements (products) in the offer.
    #
    # Returns integer.
    def offer_prices
      onp = try(:offerable_numeric_price) # average price for the products in the offer
      onp.nan? ? 0 : onp&.to_i
    end
  end
end
