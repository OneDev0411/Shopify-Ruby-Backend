# frozen_string_literal: true
# lib/tasks/cache_collections_keys.rake

namespace :cache_collections_keys do
  desc 'Set Redis keys based on shopify_id for collections'

  task :set_collections_keys => :environment do
    cache_keys_batch_limit = ENV.fetch('CAHCE_KEYS_BATCH_LIMIT', 1000).to_i

    # select collections having active shop only
    Collection.joins(:shop)
           .where(shops: { is_shop_active: true })
           .pluck(:shopify_id)
           .each_slice(cache_keys_batch_limit) do |shopify_ids_batch|
      set_collections_redis_keys('collection', shopify_ids_batch)
    end
  end

  def set_collections_redis_keys(type, shopify_ids)
    redis_data = shopify_ids.map { |id| ["shopify_#{type}_#{id}", 1] }
    begin
      $redis_cache.mset(*redis_data.flatten)
    rescue => e
      Rails.logger.error "Redis Error, #{e.class}: #{e.message}"
    end
  end
end
