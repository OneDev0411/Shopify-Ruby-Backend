# frozen_string_literal: true

# a generic service to report error to APM/Error Tracker
class ErrorNotifier < ApplicationService
  def initialize(error)
    super()
    @error = error
  end

  def call
    # using AppSignal as default Error Tracker
    Appsignal.set_error(@error)
  end
end
