# frozen_string_literal: true

FactoryBot.define do
  # wrap all specialized factories in this empty factory named after the class, so that we don't
  # have to specify class: everywhere
  factory :offer do
    factory :simple_offer do
      association :shop
      association :product
      title              { 'Enjoy a new T-shirt!' }
      offer_text         { 'Would you like to add a {{ product_title }}?' }
      offer_cta          { 'Add To Cart' }
      theme              { 'turquoise' }
      active             { true }
      offerable_product_shopify_ids { [5_440_529_858_715] }
      show_product_image { true }
      rules_json         { [{ 'quantity': 1, 'item_name': '100', 'item_type': 'string',
                              'rule_selector': 'total_at_least', 'item_shopify_id': nil },
                            { 'quantity': 1, 'item_name': 'tagged', 'item_type': 'string',
                              'rule_selector': 'customer_is_tagged', 'item_shopify_id': nil },
                            { 'quantity': 1, 'item_name': 'Bikes Collection', 'item_type': 'collection',
                              'rule_selector': 'cart_at_least', 'item_shopify_id': 210414338203 }] }
      offerable_type     { 'multi' }
      included_variants  { { '5440529858715' => [35_245_784_858_779] } }
      in_cart_page       { true }
      in_ajax_cart       { false }
      in_product_page    { true }

      factory :draft_offer do
        active { false }
      end

      trait :with_offer_stat do
        after(:create) do |offer, _evaluator|
          FactoryBot.create_list(:offer_stat, 17, offer: offer)
        end
      end

      trait :with_product do
        after(:create) do |offer, _evaluator|
          FactoryBot.create_list(:product, 2, offer: offer)
        end
      end

      trait :with_old_rules do
        rules_json { [{ 'uuid': 'd9ac2469-fb2f-7e07-1151-49c12', 'item_id': 684571754524,
                        'quantity': 1,'item_name': 'Karlix Picnic Basket', 'item_type': 'product',
                        'rule_type': 'cart_at_least' },
                      { 'uuid': '45gt2469-hj78-7e07-1151-d3c12', 'item_id': 2341114524,
                        'quantity': 0, 'item_name': 'Classic Picnic Basket', 'item_type': 'product',
                        'rule_type': 'cart_does_not_contain' },
                      {'uuid': 'ff56hy2469-fb2f-7e07-436f', 'item_id': 12901754524, 'quantity': 1,
                       'item_name': 'Modern Picnic Basket', 'item_type': 'product',
                       'rule_type': 'cart_at_least' },
                      { 'uuid': 'ou6hy2469-fb2f-7e07-436f', 'item_id': 0331754524, 'quantity': 1,
                        'item_name': 'Modern Picnic Basket', 'item_type': 'product', 'type': 'product' }
                     ] }
      end
    end
  end
end
