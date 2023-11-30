# frozen_string_literal: true

class AuthenticatedController < ApplicationController
  include ShopifyApp::EnsureHasSession

  # check if the current shop is admin or not
  # if it is not admin, redirected to the root path and return false
  protected
  def require_admin
    shop = Shop.find_by(shopify_domain: current_shopify_domain)
      unless shop.admin
        redirect_to(root_path, status: :unauthorized, notice: 'Page Not Available')
        return false
      end
      true
  end
end
