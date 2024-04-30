namespace :plan do
  
  desc 'A one time task that saves initial plan'
  task initialize_plan_data: :environment do
    count = 0
    [{
      key: 'Plan:Flex:Shopify_Plus',
      price: 99.99
    },
     {
       key: 'Plan:Flex:Advanced_Shopify',
       price: 59.99
     },
     {
       key: 'Plan:Flex:Shopify',
       price: 9.99
     },
     {
       key: 'Plan:Flex:Basic_Shopify',
       price: 19.99
     },
     {
       key: 'Plan:Trial:Trial_Plan',
       price: 0
     },
     {
       key: 'Plan:Free:Free',
       price: 0
     }].each do |plan|
      PlanRedis.new(key: plan[:key], price: plan[:price])
      count += 1
    end
    puts "added #{count} plans"
  end
end
