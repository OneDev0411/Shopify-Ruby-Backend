json.url @redirect_url
json.current_shopify_domain @icushop.shopify_domain
json.plan_name @subscription.plan.name

if @plan.requires_payment?
  json.payment :yes
else
  json.payment :no
  if @subscription.free_plan_after_trial
    json.message "Your plan will be switched after trial period is over"
  else
    json.message "On Free Plan Now"
  end
end