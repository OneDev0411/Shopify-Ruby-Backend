# frozen_string_literal: true

# = ApiException
# This module centralizes handling of pre-defined exceptions
# For use, include ApiException::Handler on your controller
# For delegate all of application error, Simply include the handler on your ApplicationController
#
module ApiException
  # = EXCEPTIONS
  # You can define your own exception on here.
  #
  EXCEPTIONS = {
    #400
    'ActiveRecord::RecordInvalid' => { status: 400, error_code: 40001, message: 'Invalid request' },
    'BadRequest' => { status: 400, error_code: 40002, message: 'Your own message in here' },

    #401
    'Unauthorized' => { status: 401, error_code: 40101, message: 'Your own message in here' },

    #403
    'Forbidden' => { status: 403, error_code: 40301, message: 'Your own message in here' },

    #404
    'ActiveRecord::RecordNotFound' => { status: 404, error_code: 40401, message: 'Can not find record' },
    'NotFound' => {status: 404, error_code: 40402, message: 'Can not find record'}
  }

  class BaseError < StandardError; end

  module Handler
    def self.included(klass)
      klass.class_eval do
        EXCEPTIONS.each do |exception_name, context|
          unless ApiException.const_defined?(exception_name)
            ApiException.const_set(exception_name, Class.new(BaseError))
            exception_name = "ApiException::#{exception_name}"
          end

          rescue_from exception_name do |exception|
            Rails.logger.debug "Error Message: #{e.message}"
            Rollbar.error("Error", e)
            render status: context[:status], json: { error_code: context[:error_code], message: context[:message], detail: (exception.message) }.compact
          end
        end
      end
    end
  end
end
