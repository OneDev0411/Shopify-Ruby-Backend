# coding: utf-8
# frozen_string_literal: true

module IcuModels
  module Webhooks
    include ShopifyAPI::Webhooks::Handler

    def shopify_webhook_topics
      %w[app/uninstalled orders/create shop/update products/create products/update
         collections/create collections/update products/delete themes/publish themes/update]
    end

    def publish_event_bridge_webhooks(session)
      eventsource_arn = ENV['EVENTSOURCE_ARN']
      shopify_webhook_topics.each do |t|
        if ShopifyAPI::Webhooks::Registry.get_webhook_id(topic: t, client: graql_client(session)) != nil
          ShopifyAPI::Webhooks::Registry.unregister( topic: t, session: session)
        end
        ShopifyAPI::Webhooks::Registry.add_registration(topic: t, delivery_method: :event_bridge, path: eventsource_arn)
        ShopifyAPI::Webhooks::Registry.register( topic: t, session: session)
      end
    end

    def delete_event_bridge_webhooks(session)
      shopify_webhook_topics.each do |t|
        if ShopifyAPI::Webhooks::Registry.get_webhook_id(topic: t, client: graql_client(session)) != nil
          ShopifyAPI::Webhooks::Registry.unregister( topic: t, session: session)
        end
      end
    end

    private

    def graql_client(session)
      ShopifyAPI::Clients::Graphql::Admin.new(
        session: session
      )
    end
  end
end
