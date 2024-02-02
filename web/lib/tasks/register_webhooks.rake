namespace :register_webhooks do

  desc 'Register webhooks for all active users'
  task register_webhooks: :environment do
    puts "hola"
    Shop.where(is_shop_active: true, id: 5).find_in_batches(batch_size: 20) do |shops|
      puts "yes"
      shops.each do |shop|
        puts "shop"
        begin
          shop.ensure_incartupsell_webhooks
          shop.update(script_tag_location: 'icu_webhooks')
        rescue StandardError => e
          puts e.message
          Rails.logger.debug "Error Message: #{e.message}"
        end
      end
    end
  end
end