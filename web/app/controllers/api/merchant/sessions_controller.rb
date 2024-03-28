module Api
  module Merchant
    class SessionsController < ApiMerchantBaseController      
      before_action :session_params, only: [:create]
      before_action :set_session, only: [:create]
      before_action :find_by_session_id, only: [:show, :delete]
      before_action :find_by_session_ids, only: [:delete_multiple]
      before_action :find_by_shopify_domain, only: [:find_sessions_by_shop]

      def create
        session_service = SessionService.new
        if @session.present?
          session_service.update_session(@session_params, @session)
        else
          session_service.create_session(@session_params)
        end
        render json: response[:message], status: response[:status]
      end

      def show
        if @session.present?
          render json: @session, message: 'Session Found', status: :ok
        else
          render json: { message: 'Session not found' }, status: :not_found
        end
      end

      def delete
        if @session.present? && @session.delete
          render json: { message: 'Session deleted successfully' }, status: :ok
        else
          render json: { message: 'Session could not be deleted' }, status: :not_found
        end
      end

      def delete_multiple
        if @sessions.any? && @sessions.delete_all
          render json: { message: 'Sessions deleted successfully' }, status: :ok
        else
          render json: { message: 'Sessions could not be deleted' }, status: :not_found
        end
      end

      def find_sessions_by_shop
        if @sessions.any?
          render json: @sessions, message: " #{@sessions.count} Sessions Found", status: :ok
        else
          render json: { message: 'No session found with given shopify domain' }, status: :not_found
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

      def find_by_session_ids
        @sessions = Session.where(session_id: params[:ids])
      end

      def find_by_shopify_domain
        @sessions = Session.where(shop_domain: params[:domain])
      end
    end
  end
end
