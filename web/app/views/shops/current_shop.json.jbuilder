json.shop @shop.as_json(include: [:plan, :subscription])
json.days_remaining_in_trial @shop.subscription&.days_remaining_in_trial
json.has_offers @shop.offers.present?
json.offers_limit_reached @shop.offers_limit_reached?

json.theme_app_extension @shop.theme_app_extension.as_json

json.active_offers_count @shop.active_offers.count
if @icushop.plan&.free_plan?
  json.plan :free
elsif @icushop.plan&.flex_plan?
  json.plan :flex
elsif @icushop.plan&.trial_plan?
  json.plan :trial
end

subscription = @shop.subscription
if subscription
  json.subscription_not_paid subscription.subscription_not_paid
end