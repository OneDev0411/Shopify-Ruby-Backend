# frozen_string_literal: true
# lib/tasks/cache_products_keys.rake

namespace :cache_products_keys do
  desc 'Set Redis keys based on shopify_id for products'

  task :set_products_keys => :environment do
    cache_keys_batch_limit = ENV.fetch('CAHCE_KEYS_BATCH_LIMIT', 1000).to_i

    # select products having active shop only
    Product.joins(:shop)
           .where(shops: { is_shop_active: true })
           .pluck(:shopify_id)
           .each_slice(cache_keys_batch_limit) do |shopify_ids_batch|
      set_products_redis_keys('product', shopify_ids_batch)
    end
  end

  def set_products_redis_keys(type, shopify_ids)
    redis_data = shopify_ids.map { |id| ["shopify_#{type}_#{id}", 1] }
    begin
      $redis_cache.mset(*redis_data.flatten)
    rescue => e
      Rails.logger.error "Redis Error, #{e.class}: #{e.message}"
    end
  end
end
