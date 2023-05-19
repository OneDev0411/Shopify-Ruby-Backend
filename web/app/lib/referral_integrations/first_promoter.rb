module ReferralIntegrations
  module FirstPromoter
    # First Promoter is the referral platform that we are using for referral tracking purposes
    class << self

      def signup_referral(shopify_domain, referral_code)
        # track referral by signup at FirstPromoter
        fp_signup_uri = 'https://firstpromoter.com/api/v1/track/signup'

        data = {
          'uid': shopify_domain,
          'ref_id': referral_code
        }
        response = HTTParty.post(fp_signup_uri,
          body: URI.encode_www_form(data),
          headers: {
            'Content-Type' => 'application/x-www-form-urlencoded',
            'x-api-key' => ENV['FIRST_PROMOTER_API_KEY']
          }
        )

        response_body = response.body.present? ? JSON.parse(response.body) : {}
        [response.code, response_body]
      end

      def delete_referral(shopify_domain)
        fp_delete_lead_uri = 'https://firstpromoter.com/api/v1/leads/delete'

        data = {
          'uid': shopify_domain,
        }
        response = HTTParty.delete(fp_delete_lead_uri,
          body: URI.encode_www_form(data),
          headers: {
            'Content-Type' => 'application/x-www-form-urlencoded',
            'x-api-key' => ENV['FIRST_PROMOTER_API_KEY']
          }
        )

        response_body = response.body.present? ? JSON.parse(response.body) : {}
        [response.code, response_body]
      end

      def track_sale(shopify_domain, payment_id, amount_in_cents, referral_code=nil)
        fp_track_sale_uri = 'https://firstpromoter.com/api/v1/track/sale'

        data = {
          'uid': shopify_domain,
          'event_id': payment_id,
          'amount': amount_in_cents
        }
        data.merge!('ref_id': referral_code) if referral_code.present?

        response = HTTParty.post(fp_track_sale_uri,
          body: URI.encode_www_form(data),
          headers: {
            'Content-Type' => 'application/x-www-form-urlencoded',
            'x-api-key' => ENV['FIRST_PROMOTER_API_KEY']
          }
        )

        response_body = response.body.present? ? JSON.parse(response.body) : {}
        [response.code, response_body]
      end

      def untrack_sale(shopify_domain)
        fp_untrack_sale_uri = 'https://firstpromoter.com/api/v1/track/cancellation'

        data = {
          'uid': shopify_domain,
        }
        response = HTTParty.post(fp_untrack_sale_uri,
          body: URI.encode_www_form(data),
          headers: {
            'Content-Type' => 'application/x-www-form-urlencoded',
            'x-api-key' => ENV['FIRST_PROMOTER_API_KEY']
          }
        )

        response_body = response.body.present? ? JSON.parse(response.body) : {}
        [response.code, response_body]
      end
    end
  end
end
