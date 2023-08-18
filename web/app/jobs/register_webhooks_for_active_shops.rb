class RegisterWebhooksForActiveShops < ApplicationJob
  queue_as :default

  def perform
    register_webhooks_for_active_shops
  end

  private

  def register_webhooks_for_active_shops
    Shop.find_each do |shop|
      if shop.shopify_token.present?
        Sidekiq::Client.push('class' => 'ShopWorker::EnsureInCartUpsellWebhooksJob', 'args' => [shop.id], 'queue' => 'default', 'at' => Time.now.to_i)
      end
    end
  end
end
