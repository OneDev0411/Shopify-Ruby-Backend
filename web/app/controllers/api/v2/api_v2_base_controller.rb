# frozen_string_literal: true

module Api
  module V2
    class ApiV2BaseController < ::ActionController::Base
      
      protect_from_forgery with: :null_session
      skip_before_action :verify_authenticity_token
      
      before_action :allow_cors
  
      protected
      def allow_cors
        response.headers['Access-Control-Allow-Origin'] = ENV['FRONTEND_URL']
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Headers'] = 'accept, content-type'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST'
      end
  
    end # class ends
  end
end
