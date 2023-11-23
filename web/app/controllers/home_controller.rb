# frozen_string_literal: true

class HomeController < AuthenticatedController
  before_action :find_shop
  before_action :shop_is_admin, except: [:index]

  def index
    @active_offers_count = @icushop.offers.active.count
  end

  def shop_is_admin?
    if @admin.blank?
      redirect_to(root_path, status: 401, notice: 'Page Not Available')
      return false
    end
    true
  end
end
