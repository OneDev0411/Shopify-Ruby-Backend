# frozen_string_literal: true
module Api
  module V2
    module Merchant
      class PartnersController < ApiMerchantBaseController

        # GET /partners
        def index
          @partners = Partner.all.order("RANDOM()")
          render "partners/index"
        end

      end
    end
  end
end
