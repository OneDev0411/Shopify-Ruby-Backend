module Api
  module Merchant
    class SessionsController < ApiMerchantBaseController      
      
      before_action :session_params, only: [:store_session]

      def store_session
        session = Session.find_by_session_id(session_params[:session_id])
        if session.present?
          puts "Session Present!!! #{session.id}"
          begin
            if session.update(session_params)
              render json: { message: 'Session Updated successfully'}, status: :ok
            else
              render json: { message: 'Session can not be updated'}, status: 500
            end
          rescue => err
            ErrorNotifier.call(err)
          end
        else
          session = Session.new(session_params)
          begin
            if session.save
              render json: { message: 'Session stored successfully'}, status: :ok
            else
              render json: { message: 'Session can not be created'}, status: 500
            end
          rescue => err
            ErrorNotifier.call(err)
          end
        end
      end

      private

      def session_params
        params.require(:session).permit(:session_id, :shop_domain, :state, :is_online, :access_token, :scope, :expires)
      end
    end
  end
end
