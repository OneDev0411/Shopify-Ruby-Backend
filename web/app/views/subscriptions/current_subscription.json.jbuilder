if @subscription.id.present?
  json.subscription @subscription
  json.days_remaining_in_trial @subscription.days_remaining_in_trial
  json.active_offers_count @icushop.active_offers.count
  json.unpublished_offer_ids @icushop.unpublished_offer_ids
  json.subscription_not_paid @subscription.subscription_not_paid

  if @subscription.plan&.free_plan?
    json.plan :free
  elsif @subscription.plan&.flex_plan?
    json.plan :flex
  elsif @subscription.plan&.trial_plan?
    json.plan :trial
  end
end