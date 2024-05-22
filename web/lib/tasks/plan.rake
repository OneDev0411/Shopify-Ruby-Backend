namespace :plan do

  desc 'A one time task that saves initial plan'
  task initialize_plan_data: :environment do
    count = 0
    [
      {
        key: 'Plan:Flex:Shopify_Plus',
        plan_set: 'flex',
        is_visible: true,
        is_active: true,
        price: 99.99
      },
      {
        key: 'Plan:Flex:Advanced_Shopify',
        plan_set: 'flex',
        is_visible: true,
        is_active: true,
        price: 59.99
      },
      {
        key: 'Plan:Flex:Shopify',
        plan_set: 'flex',
        is_visible: true,
        is_active: true,
        price: 29.99
      },
      {
        key: 'Plan:Flex:Basic_Shopify',
        plan_set: 'flex',
        is_visible: true,
        is_active: true,
        price: 19.99
      },
      {
        key: 'Plan:Free:Trial_Plan',
        price: 0,
        plan_set: ''
      },
      {
        key: 'Plan:Free:Free',
        plan_set: '',
        price: 0
      }
    ].each do |plan|
      PlanRedis.new(key: plan[:key], price: plan[:price], plan_set: plan[:plan_set],
                    is_visible: plan[:is_visible], is_active: plan[:is_active])
      count += 1
    end
    puts "added #{count} plans"
  end
end
