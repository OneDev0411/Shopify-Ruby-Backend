namespace :plan do
  
  desc 'A one time task that saves initial plan'
  task initialize_plan_data: :environment do
    count = 0
    [{
      key: 'Flex:Shopify_Plus',
      price: 99.99
    },
     {
       key: 'Flex:Advanced_Shopify',
       price: 59.99
     },
     {
       key: 'Flex:Shopify',
       price: 9.99
     },
     {
       key: 'Flex:Basic_Shopify',
       price: 19.99
     },
     {
       key: 'Flex:Free',
       price: 0
     }].each do |plan|
      PlanRedis.new(key: plan[:key], price: plan[:price])
      count += 1
    end
    puts "added #{count} plans"
  end
end
