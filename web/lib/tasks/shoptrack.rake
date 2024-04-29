namespace :shoptrack do

  desc "Check for uninstalled shop keys"
  task check_shop_keys: :environment do
    #   Check redis for uninstalled shop keys
    # Check keys to ensure the shops were properly uninstalled
    begin
      uninstalled_keys = $redis_cache.keys("shopify_uninstalled*")

      if uninstalled_keys.length >= 1

        uninstalled_values = $redis_cache.mget(uninstalled_keys)

        shopify_domains = uninstalled_keys.each_with_index.map {|key, value|
          shopify_domain = key.gsub("shopify_uninstalled_", "")
          uninstall_timestamp = uninstalled_values[value]
          # Format of the time stamp is unix
          [shopify_domain, uninstall_timestamp]
        }

        shopify_domains.each {|pair |
          # Should should run hours be an environment variable
          if has_time_elapsed(pair[1], 400) && !is_shop_uninstalled(pair[0], pair[1])
            Sidekiq::Client.push('class' => 'ShopWorker::MarkShopAsCancelledJob', 'args' => [domain], 'queue' => 'low', 'at' => Time.now.to_i + 10)
          end
        }

      end
    rescue => e
      Rails.logger.error "Redis Error, #{e.class}: #{e.message}"
    end
  end

  desc "Check if api keys are valid"
  task api_key_check: :environment do
    #   loop through all shops and call shopify api and check if keys are valid

    puts "running api_key_check"
    Shop.find_in_batches(batch_size: 20) do |shop|
      shops.each do |shop|
        begin
          session = shop.activate_session

          response = ShopifyAPI::AccessScope.all(session: session,)
          shop.update_column("is_shop_active", true)
        rescue StandardError => e
          if e.message.include?("Invalid API key")
            shop.update_column("is_shop_active", false)
          end

          Rails.logger.debug "Error Message: #{e.message}"
        end
      end
    end
  end

  desc 'A one time task to initialize tracking of the plan and plan sets of active shops'
  task initialize_shop_plan_tracking: :environment do
    puts 'initializing shop plan tracking'

    Shop.where(is_shop_active: true).each do |shop|
      # Using the shopify plan name and internal plan name to compose a key,
      # we find the matching plan and create an entry
      plan_name = shop.shopify_plan_name.gsub(/\s/, '_')
      key_prefix = shop.plan.name.capitalize

      plan = PlanRedis.get_with_fields({ key: "#{key_prefix}:#{plan_name}" })
      ShopPlan.new(key: shop.id, plan_key: plan.key, plan_set: plan.plan_set)
    end
  end

  private

  def is_shop_uninstalled(domain, uninstall_timestamp)
    shop = Shop.find_by(shopify_domain: domain)
    !shop.is_shop_active && shop.shop_action.select('id').where(["action = ? and action_timestamp > ?", "install", uninstall_timestamp]).limit(1)
  end

  # Checks if the time a job had been expected to run for has elapsed
  # @param timestamp Time when job ran
  # @param should_run_time Time (in seconds) the project should have taken to run
  def has_time_elapsed(timestamp, should_run_time)
    past = Time.at(timestamp)
    now = Time.now.utc
    now - past > (should_run_time)
  end
end
