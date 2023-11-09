# frozen_string_literal: true

class JsController < ApplicationController
  # Use the Shopify PROXY api to see if the currently logged in shopper has any tags
  # used in tags offer rule
  def offer
    return unless params[:cartaction] == 'customertags'

    render 'customer', content_type: 'application/liquid', layout: 'blank' and return
  end
  def confirm_from_outside
    @shop_domain = Shop.find_by(shopify_domain: params[:shop]).shop_domain
  end
end
