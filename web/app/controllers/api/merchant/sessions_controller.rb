module Api
  module Merchant
    class SessionsController < ApiMerchantBaseController      
      
      before_action :session_params, only: [:store_session]
      before_action :set_session, only: [:store_session]
      before_action :find_by_session_id, only: [:load_session]

      def store_session
        session = SessionService.new
        @session.present? ? session.update_session(@session_params, @session) : session.create_session(@session_params)
        render json: response[:message], status: response[:status]
      end

      def load_session
        if @session.present?
          render json: @session, status: :ok
        else
          render json: { message: 'Session not found' }, status: :not_found
        end
      end

      private

      def session_params
        @session_params = params.require(:session).permit(:session_id, :shop_domain, :state, 
                                                          :is_online, :scope, :expires)
      end

      def set_session
        @session = Session.find_by_session_id(@session_params[:session_id])
      end

      def find_by_session_id
        @session = Session.find_by_session_id(params[:id])
      end
    end
  end
end
