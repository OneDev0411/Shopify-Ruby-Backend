json.shop @shop.as_json(include: [:plan, :subscription])
json.days_remaining_in_trial @shop.subscription&.days_remaining_in_trial
json.active_offers_count @shop.active_offers.count
if @icushop.plan&.free_plan?
  json.plan :free
elsif @icushop.plan&.flex_plan?
  json.plan :flex
elsif @icushop.plan&.trial_plan?
  json.plan :trial
end