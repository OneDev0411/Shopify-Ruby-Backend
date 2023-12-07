# frozen_string_literal: true

class HomeController < AuthenticatedController
  before_action :find_shop

end
