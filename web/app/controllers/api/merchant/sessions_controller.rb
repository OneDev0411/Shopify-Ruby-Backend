module Api
  module Merchant
    class SessionsController < ApiMerchantBaseController      
      
      before_action :session_params, only: [:store_session]
      before_action :find_by_session_id, only: [:store_session]

      def store_session
        session = SessionService.new
        @session.present? ? session.update_session(@session_params, @session) : session.create_session(@session_params)
        render json: response[:message], status: response[:status]
      end

      private

      def session_params
        @session_params = params.require(:session).permit(:session_id, :shop_domain, :state, :is_online, :access_token, 
                                                          :scope, :expires)
      end

      def find_by_session_id
        @session = Session.find_by_session_id(@session_params[:session_id])
      end
    end
  end
end
