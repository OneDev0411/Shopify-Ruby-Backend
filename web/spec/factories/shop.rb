# frozen_string_literal: true

FactoryBot.define do
  factory :shop do
    initialize_with {
       Shop.where(shopify_domain: 'dev-store-manuel.myshopify.com')
           .first_or_create(attributes)
    }
    shopify_domain { 'dev-store-manuel.myshopify.com' }
    name { 'dev-store-manuel' }
    shopify_id { 43_462_361_243 }
    email { 'manuel.montoya@resolvedigital.com' }
    shopify_token { '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' }
    uses_ajax_cart { true }
    finder_token { 'BGQC7CWb-sWVPSc2MWyx' }
    extra_css_classes { 'accordionmobilefix' }
    cdn { 'stackpath' }
    has_remove_offer { true }
    wizard_token { '8opxGqKLss_8hvFDy7po' }
    stats_synced_at { Time.now.utc }
    syncing { false }
    builder_version { 2 }
    admin { true }
    custom_bg_color { '#fff' }
    js_version { 'library' }
    stat_provider { 'heroku' }
    show_spinner { true }
    has_multi { true }
    installed_at { Time.now.utc }
    app { 'incartupsell' }
    script_tag_id { 184673304731 }
    css_options { {"main"=>
                   {"color"=>"#F0F772",
                    "marginTop"=>"0px",
                    "fontFamily"=>"inherit",
                    "borderColor"=>"#20A024",
                    "borderStyle"=>"dotted",
                    "borderWidth"=>"2",
                    "borderRadius"=>4,
                    "marginBottom"=>"50px",
                    "justifyContent"=>"center",
                    "backgroundColor"=>"#6178CA"},
                   "text"=>{"fontSize"=>"15px", "fontFamily"=>"inherit", "fontWeight"=>"bold"},
                   "image"=>{},
                   "button"=>
                   {"color"=>"#FFFFFF",
                    "width"=>"auto",
                    "marginTop"=>"0px",
                    "fontFamily"=>"inherit",
                    "fontWeight"=>"bold",
                    "marginLeft"=>"0px",
                    "paddingTop"=>"6px",
                    "marginRight"=>"0px",
                    "paddingLeft"=>"10px",
                    "borderRadius"=>"5",
                    "marginBottom"=>"5px",
                    "paddingRight"=>"10px",
                    "paddingBottom"=>"6px",
                    "backgroundColor"=>"#2B3D51"},
                   "custom"=>""} }

    trait :with_products do
      after(:create) do |shop, _evaluator|
        FactoryBot.create_list(:product, 5, shop: shop)
      end
    end
  end
end

FactoryBot.define do
  factory :second_shop, class: :shop do
    myshopify_domain { 'dev-store-manuel.myshopify.com' }
    shopify_domain { 'dev-store-manuel.myshopify.com_PREVIOUS' }
    name { 'dev-store-manuel' }
    shopify_id { 43_462_361_243 }
    email { 'second@resolvedigital.com' }
    shopify_token { 'xx' }
    uses_ajax_cart { true }
    finder_token { 'whatever' }
    uninstalled_at { Time.now.utc }
  end
end
