# frozen_string_literal: true

class ApplicationController < ActionController::Base

  protect_from_forgery
  before_action :set_host
  before_action :set_shopify_api_key
  before_action :set_headers
  before_action :set_shop_param
  before_action :set_icushop

  def admin_subscription_methods
    %w[admin_subscription admin_shopify_subscription]
  end

  def set_icushop
    if defined?(current_shopify_domain) && current_shopify_domain.present?
      @icushop = Shop.find_by(shopify_domain: current_shopify_domain)
      @icushop.update_attribute(:shop_domain, Base64.decode64(@host)) if @host.present? && @icushop.present?
    end
  rescue ShopifyApp::ShopifyDomainNotFound => e
    # This is fine for this particular method since all we are doing is to find the shop
    # Also, deliberately leaving this comment because we want to keep this rescue block as it is
    # because there are several other endpoints which aren't part of shopfiy's embedded app but we still want them to be functional
  end

  def find_shop
    redirect_to login_path and return unless defined?(current_shopify_domain)

    @icushop = Shop.find_or_create_shop(current_shopify_domain)
    @icushop.check_shopify_token(@current_shopify_session&.access_token)

    # check to see if current token is valid, otherwise need a new login
    if @icushop.needs_new_token?
      redirect_to "#{ENV.fetch("DOMAIN_URL")}api/auth?shop=#{@icushop.shopify_domain}"
      return
    end

    # This is for the Admin section, to see other shops UI
    @admin = @icushop.admin?
    if @admin && params[:shop_id].present? && !admin_subscription_methods.include?(params[:action])
      @icushop = Shop.find_by(id: params[:shop_id])
    end
    true
  end

  # Public. Be sure this shop has a valid and active subscription.
  #
  # Return Boolean.
  def ensure_plan
    return true if @admin || (@icushop.plan.present? &&
                              @icushop.subscription.status == 'approved')

    message = if @icushop.plan.nil?
                'Please Choose A Plan'
              else
                'Your subscription is not active - please re-confirm your plan on this page.'
              end

    redirect_to edit_subscription_path(shop: @icushop.shopify_domain), notice: message and return
  end

  def set_shopify_api_key
    @shopify_api_key = ENV['SHOPIFY_APP_API_KEY']
  end

  def layout_for_shop
    'application'
  end

  private

  def set_host
    @host = params[:host]
  end

  def session_shopify
    @session_shopify ||= session.dig('shopify.omniauth_params', 'shop')
  end

  def set_headers
    if params[:shop].present?
      shop_domain =  ShopifyApp::Utils.sanitize_shop_domain(params[:shop])
    else
      shop_domain = '*.myshopify.com'
    end

    response.headers['content-security-policy'] = "frame-ancestors https://#{shop_domain} https://admin.shopify.com;"
  end

  def set_shop_param
    if !params[:shop].present?
      @shop = Shop.find(params[:shop_id]) if params[:shop_id].present?
      params[:shop] = @shop.try(:shopify_domain) if @shop.present?
    end
  end

end
