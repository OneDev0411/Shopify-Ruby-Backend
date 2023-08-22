class DeleteEventbridgeWebhooks < ApplicationJob
  queue_as :default

  def perform
    delete_eventbridge_webhooks_for_shops
  end

  private

  def delete_eventbridge_webhooks_for_shops
    Shop.find_each do |shop|
      begin
        if shop.shopify_token.present?  
          Sidekiq::Client.push('class' => 'ShopWorker::DeleteInCartUpsellEventbridgeWebhooksJob', 'args' => [shop.id], 'queue' => 'default', 'at' => Time.now.to_i)
        end
      rescue Exception => e
        Rollbar.error('Error while deleting webhooks', e)
        next
      end
    end
  end
end
