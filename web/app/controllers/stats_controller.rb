# frozen_string_literal: true

class StatsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create_stats]

  protect_from_forgery with: :null_session

  # POST  /stats/create_stats
  def create_stats
    new_stat = { offer_id: offer_params['offerId'],
                 place: offer_params['page'],
                 test_ab: offer_params['offerVariant'],
                 action: offer_params['action'],
                 cart_token: offer_params['cart_token'],
                 variant_id: offer_params['selectedShopifyVariant'] }

    ShopWorker::SaveOfferStatJob.perform_async(new_stat)
    if offer_params['action'] == 'click' && offer_params['cart_token'].present?
      ShopWorker::SaveOfferEventJob.perform_async(offer_params)
    end

    render json: { message: 'OK', error: false }
  end

  private

  def offer_params
    params.require('stat').permit('offerId', 'offerVariant', 'page', 'method', 'shopDate', 'action',
                                  'selectedShopifyVariant', 'cart_token')
  end
end
