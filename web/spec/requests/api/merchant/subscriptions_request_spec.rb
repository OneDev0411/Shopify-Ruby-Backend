# frozen_string_literal: true

RSpec.describe Api::Merchant::SubscriptionsController, type: :request do

  let(:shop) { FactoryBot.build :shop }
  let(:plan) { FactoryBot.create :flex_plan }
  let(:subscription) { FactoryBot.create :subscription, shop: shop, plan: plan }
  let(:json_headers) { { 'Content-Type' => 'application/json', 'ACCEPT' => 'application/json' } }

  describe 'PUT#update' do
    it 'returns a JSON with the subscription data' do
      IcuLogging.dbug __LINE__, File.basename(__FILE__), 'plan', plan
      put api_merchant_subscription_path, params: { shop: shop.shopify_domain,
                                                    subscription: { plan_internal_name: plan.internal_name } }

      parsed_json = JSON.parse(response.body)

      expect(response).to have_http_status(:ok)
      # expect(parsed_json['message']).to eq true
    end
  end
end

