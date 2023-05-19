# frozen_string_literal: true

module Api
  module V1
    class ApiBaseController < ::ActionController::API

      include ApiException::Handler

      # before_action :allow_cors

      # API Authentication
      def authenticate_with_token
        begin
          auth_token = params['key_token']
          unless authenticate_with_auth_token(auth_token)
            render json: { error: 'unauthorized' }, status: :unauthorized
           return false
          end
          true
        rescue StandardError => e
          Rails.logger.debug "Error Message: #{e.message}"
          Rollbar.error('Error', e)
        end
      end

      protected

      def allow_cors
        response.headers['Access-Control-Allow-Origin'] = request.headers['Origin'] || '*'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Headers'] = 'accept, content-type'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT'
      end

      private

        # Private: Auth with key.
        #
        # Returns boolean.
        def authenticate_with_auth_token(auth_token)
          ICU_API_KEY_TOKEN.present? && ICU_API_KEY_TOKEN == auth_token
        end

    end # class ends
  end
end

