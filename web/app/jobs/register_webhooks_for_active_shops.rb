class RegisterWebhooksForActiveShops < ApplicationJob
  queue_as :default

  def perform
    register_webhooks_for_active_shops
  end

  private

  def register_webhooks_for_active_shops
    Shop.active.find_each do |shop|
      ShopWorker::EnsureInCartUpsellWebhooksJob.perform_async(shop.id)
    end
  end
end
