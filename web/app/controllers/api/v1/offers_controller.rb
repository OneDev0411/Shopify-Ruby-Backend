# frozen_string_literal: true

module Api
module V1
  class OffersController < ApiBaseController
    before_action :set_offer, only: [:offer_details]
    before_action :set_shop, only: [:offers_list]

    # POST /api/v1/offers_list
    def offers_list
      render json: { shopify_domain: @icushop.shopify_domain, offers: @icushop.offers }
    end

    # POST /api/v1/offer_details
    def offer_details
      begin
        library_json = @offer.library_json
        library_json[:publish_status] = @offer.active ? 'published' : 'draft'

        render json: library_json
      rescue StandardError => e
        Rails.logger.debug "Error Message: #{e.message}"
        Rollbar.error('Error', e)
      end
    end

    # POST /api/v1/offer_settings
    # Load the generic offer settings ( the whole shop config stuff )
    def offer_settings
      begin
        incsamppro = offer_params['include_sample_products'] == 1
        render json: @icushop.offer_settings(include_sample_products: incsamppro)
      rescue StandardError => e
        Rails.logger.debug "Error Message: #{e.message}"
        Rollbar.error("Error", e)
      end
    end

    # POST /api/v1/reorder_position_order
    # Receive and pass values to reorder the offers
    def reorder_position_order
      begin
        render json: @icushop.reorder_batch_offers(offer_params[:offers_ids])
      rescue StandardError => e
        Rails.logger.debug "Error Message: #{e.message}"
        Rollbar.error("Error", e)
      end
    end

    # POST /api/v1/offer_activate
    # This is what gets called when you click the Publish / Unpublish
    # buttons on the dashboard
    def activate
      begin
        if @icushop.offers_limit_reached?
          render json: { message: 'Offer limit reached' }, status: :ok and return
        end

        offer = @icushop.offers.find offer_params['offer_id']

        if offer.update({ published_at: Time.now.utc, deactivated_at: nil, active: true })
          @icushop.publish_async

          render json: { message: 'Offer published', status: 'Active' }, status: :ok
        else
          render json: { message: "Error: #{offer.errors.full_messages.first}" },
                      status: :internal_server_error
        end
      rescue ActiveRecord::RecordNotFound, StandardError => e
        Rails.logger.debug "Error Message: #{e.message}"
        Rollbar.error("Error", e)
      end
  end

  # POST /api/v1/offer_deactivate
  def deactivate
    begin
      offer = @icushop.offers.find(offer_params['offer_id'])
      if offer.update({ published_at: nil, active: false })
        @icushop.publish_async
        render json: { message: 'Offer Saved As Draft',  status: 'Draft' }, status: :ok
      else
        render json: { message: "Error: #{offer.errors.full_messages.first}" }, status: :internal_server_error
      end
    rescue ActiveRecord::RecordNotFound, StandardError => e
      Rails.logger.debug "Error Message: #{e.message}"
      Rollbar.error("Error", e)
    end
  end

    private

    # Never trust parameters from the scary internet, only allow the white list.
    def offer_params
      params.require('offer').permit('offer_id', 'shop_domain', 'include_sample_products', offers_ids: [])
    end

    def set_offer
      @offer = Offer.find(offer_params['offer_id'])
    end

    def set_shop
      begin
        @icushop = Shop.find_by shopify_domain: request.headers['jwt.shopify_domain']
      rescue ActiveRecord::RecordNotFound
        raise ApiException::NotFound
      end
    end
  end
end
end
