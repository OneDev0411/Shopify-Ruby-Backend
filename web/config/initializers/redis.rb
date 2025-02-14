require 'sidekiq'
require 'sidekiq-status'

$redis = Redis.new(url: ENV['REDIS_URL'], ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE })

$redis_cache = Redis.new(url: ENV['REDIS_CACHE_URL'], ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE })

$redis_plans_cache = Redis.new(url: ENV['REDIS_PLANS_CACHE_URL'], ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE })

$redis_stats_cache = Redis.new(url: ENV['REDIS_STATS_CACHE_URL'], ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE })
