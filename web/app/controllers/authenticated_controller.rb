# frozen_string_literal: true

class AuthenticatedController < ApplicationController
  include ShopifyApp::EnsureHasSession

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
