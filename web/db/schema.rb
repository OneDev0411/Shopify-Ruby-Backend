# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_05_19_132005) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "intarray"
  enable_extension "pg_stat_statements"
  enable_extension "plpgsql"

  create_table "admins", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admins_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_admins_on_unlock_token", unique: true
  end

  create_table "cases", id: :serial, force: :cascade do |t|
    t.integer "shop_id"
    t.string "status"
    t.text "subject"
    t.string "category"
    t.string "email"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["shop_id"], name: "index_cases_on_shop_id"
  end

  create_table "collections", id: :serial, force: :cascade do |t|
    t.integer "shop_id"
    t.string "title"
    t.bigint "shopify_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "sort_order"
    t.integer "products_count"
    t.integer "ecwid_id"
    t.jsonb "products_json"
    t.datetime "last_synced_at", precision: nil
    t.boolean "needs_sync"
    t.jsonb "sync_times"
    t.boolean "smart"
    t.jsonb "conditions"
    t.boolean "disjunctive"
    t.bigint "job_id"
    t.text "last_error"
    t.datetime "last_error_happened_at", precision: nil
    t.jsonb "collects_json"
    t.string "sync_state"
    t.string "published_status"
    t.string "handle"
    t.index ["shop_id"], name: "index_collections_on_shop_id"
    t.index ["shopify_id"], name: "index_collections_on_shopify_id"
  end

  create_table "collects", id: :serial, force: :cascade do |t|
    t.integer "collection_id"
    t.integer "product_id"
    t.bigint "shopify_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "collection_shopify_id"
    t.bigint "product_shopify_id"
    t.index ["collection_id"], name: "index_collects_on_collection_id"
  end

  create_table "customers", id: :serial, force: :cascade do |t|
    t.bigint "shopify_id"
    t.integer "shop_id"
    t.string "email"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "shopify_domain"
    t.string "referral_code"
    t.boolean "is_referral_tracked"
    t.index ["shop_id"], name: "index_customers_on_shop_id"
    t.index ["shopify_domain", "referral_code"], name: "index_customers_on_shopify_domain_and_referral_code", unique: true
    t.index ["shopify_domain"], name: "index_customers_on_shopify_domain"
  end

  create_table "daily_stats", id: :serial, force: :cascade do |t|
    t.integer "offer_id"
    t.integer "times_loaded", default: 0, null: false
    t.integer "times_clicked", default: 0, null: false
    t.decimal "click_revenue", default: "0.0"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.date "for_date"
    t.integer "shop_id"
    t.integer "times_orig_loaded", default: 0, null: false
    t.integer "times_orig_clicked", default: 0, null: false
    t.integer "times_alt_loaded", default: 0, null: false
    t.integer "times_alt_clicked", default: 0, null: false
    t.jsonb "clicks"
    t.integer "times_showed_product", default: 0, null: false
    t.integer "times_showed_cart", default: 0, null: false
    t.integer "times_showed_popup", default: 0, null: false
    t.integer "times_clicked_product", default: 0, null: false
    t.integer "times_clicked_cart", default: 0, null: false
    t.integer "times_clicked_popup", default: 0, null: false
    t.index ["for_date", "shop_id", "offer_id"], name: "date_offer_shop_unique", unique: true
    t.index ["for_date"], name: "index_daily_stats_on_for_date"
    t.index ["offer_id"], name: "index_daily_stats_on_offer_id"
    t.index ["shop_id"], name: "index_daily_stats_on_shop_id"
  end

  create_table "delayed_jobs", id: :serial, force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at", precision: nil
    t.datetime "locked_at", precision: nil
    t.datetime "failed_at", precision: nil
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
  end

  create_table "discount_shops", force: :cascade do |t|
    t.bigint "marketing_id"
    t.bigint "shop_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["marketing_id", "shop_id"], name: "index_discount_shops_on_marketing_id_and_shop_id", unique: true
    t.index ["marketing_id"], name: "index_discount_shops_on_marketing_id"
    t.index ["shop_id"], name: "index_discount_shops_on_shop_id"
  end

  create_table "feature_requests", id: :serial, force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.integer "shop_id"
    t.integer "upvotes"
    t.integer "downvotes"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "marketing_targets", force: :cascade do |t|
    t.bigint "marketing_id", null: false
    t.boolean "is_invited", default: false
    t.boolean "has_accepted", default: false
    t.string "email", null: false
    t.string "store_url"
    t.string "secret_code", null: false
    t.index ["email"], name: "index_marketing_targets_on_email"
    t.index ["marketing_id", "email"], name: "index_marketing_targets_on_marketing_id_and_email", unique: true
    t.index ["marketing_id", "store_url"], name: "index_marketing_targets_on_marketing_id_and_store_url", unique: true
    t.index ["marketing_id"], name: "index_marketing_targets_on_marketing_id"
  end

  create_table "marketings", force: :cascade do |t|
    t.string "code", null: false
    t.integer "discount_type", default: 0, null: false
    t.integer "discount", default: 0
    t.datetime "expires", precision: nil
    t.integer "usage_limit", default: 0, null: false
    t.integer "usage_counter", default: 0
    t.boolean "is_targeted", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_marketings_on_code", unique: true
    t.index ["discount_type"], name: "index_marketings_on_discount_type"
  end

  create_table "messages", id: :serial, force: :cascade do |t|
    t.integer "case_id"
    t.integer "shop_id"
    t.text "body"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["case_id"], name: "index_messages_on_case_id"
    t.index ["shop_id"], name: "index_messages_on_shop_id"
  end

  create_table "offer_events", force: :cascade do |t|
    t.string "variant_id"
    t.string "cart_token"
    t.string "action"
    t.float "amount"
    t.jsonb "payload"
    t.bigint "offer_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["offer_id"], name: "index_offer_events_on_offer_id"
  end

  create_table "offer_stats", id: :serial, force: :cascade do |t|
    t.integer "offer_id"
    t.integer "place"
    t.bigint "variant_id"
    t.string "test_ab"
    t.string "action"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "cart_token"
    t.float "sale_value"
    t.index ["offer_id"], name: "index_offer_stats_on_offer_id"
  end

  create_table "offers", id: :serial, force: :cascade do |t|
    t.string "title"
    t.integer "shop_id"
    t.integer "product_id"
    t.boolean "active", default: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.text "offer_text"
    t.string "offer_cta"
    t.text "offer_css"
    t.text "compiled_offer_text"
    t.datetime "published_at", precision: nil
    t.string "theme"
    t.boolean "show_product_image", default: false, null: false
    t.integer "offerable_id"
    t.string "offerable_type"
    t.text "offer_text_alt"
    t.text "offer_cta_alt"
    t.text "compiled_offer_text_alt"
    t.integer "max_step_completed", default: 0, null: false
    t.boolean "show_variant_price", default: false, null: false
    t.boolean "show_powered_by", default: false, null: false
    t.boolean "link_to_product", default: false, null: false
    t.string "collection_layout"
    t.string "ruleset_type", default: "and", null: false
    t.boolean "stop_showing_after_accepted", default: false, null: false
    t.integer "position"
    t.datetime "deactivated_at", precision: nil
    t.string "discount_code"
    t.text "compiled_text_a"
    t.text "compiled_text_b"
    t.string "variants_filter"
    t.string "interval_unit"
    t.integer "interval_frequency"
    t.bigint "recharge_subscription_id"
    t.bigint "recharge_discount_product_id"
    t.string "screen_position"
    t.boolean "remove_if_no_longer_valid", default: false, null: false
    t.boolean "use_bigger_image", default: false, null: false
    t.boolean "use_huge_image", default: false, null: false
    t.integer "backup_id"
    t.bigint "offerable_shopify_id"
    t.string "offerable_stock_status"
    t.datetime "offerable_stock_status_updated_at", precision: nil
    t.string "powered_by_text_color"
    t.string "powered_by_link_color"
    t.text "offerable_shopify_title"
    t.boolean "collection_animations", default: true, null: false
    t.boolean "is_auto", default: false, null: false
    t.string "winner"
    t.datetime "winner_picked_at", precision: nil
    t.string "winner_picked_by"
    t.boolean "cart_page"
    t.boolean "cart_page_mobile"
    t.boolean "ajax_cart"
    t.boolean "ajax_cart_mobile"
    t.boolean "checkout_page"
    t.boolean "checkout_page_mobile"
    t.boolean "show_nothanks"
    t.boolean "must_accept"
    t.bigint "offerable_product_shopify_ids", default: [], array: true
    t.jsonb "multi_offerables"
    t.string "multi_layout"
    t.string "product_image_size"
    t.boolean "show_quantity_selector"
    t.jsonb "rules_json"
    t.boolean "show_custom_field"
    t.string "custom_field_name"
    t.string "custom_field_placeholder"
    t.string "discount_target_type"
    t.decimal "discount_value"
    t.string "discount_value_type"
    t.string "discount_target_selection"
    t.string "discount_allocation_method"
    t.integer "discount_prerequisite_quantity"
    t.bigint "discount_shopify_id"
    t.boolean "discount_once_per_customer"
    t.bigint "discount_shopify_pricerule_id"
    t.integer "autopilot_quantity"
    t.boolean "checkout_after_accepted"
    t.jsonb "products_to_remove"
    t.integer "carousel_per_page"
    t.string "excluded_tags"
    t.jsonb "included_variants"
    t.boolean "custom_field_required"
    t.string "custom_field_2_name"
    t.string "custom_field_2_placeholder"
    t.boolean "custom_field_2_required"
    t.string "custom_field_3_name"
    t.string "custom_field_3_placeholder"
    t.boolean "custom_field_3_required"
    t.boolean "show_product_title", default: true
    t.boolean "show_product_price"
    t.boolean "show_compare_at_price"
    t.text "custom_checkout_destination"
    t.boolean "redirect_to_product"
    t.boolean "in_cart_page", default: true
    t.boolean "in_ajax_cart", default: false
    t.boolean "in_product_page", default: false
    t.integer "position_order", default: 1
    t.index ["shop_id"], name: "index_offers_on_shop_id"
  end

  create_table "order_products", id: :serial, force: :cascade do |t|
    t.integer "order_id"
    t.bigint "shopify_product_id"
    t.index ["order_id"], name: "index_order_products_on_order_id"
    t.index ["shopify_product_id"], name: "index_order_products_on_shopify_product_id"
  end

  create_table "orders", id: :serial, force: :cascade do |t|
    t.integer "shop_id"
    t.bigint "shopify_id"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.jsonb "line_item_product_shopify_ids"
    t.text "product_shopify_ids", array: true
    t.decimal "total"
    t.string "cart_token"
    t.string "shopper_country"
    t.string "discount_code"
    t.jsonb "unique_product_ids"
    t.text "referring_site"
    t.integer "orders_count"
    t.index "jsonb_array_length(unique_product_ids)", name: "index_orders_on_number_of_unique_product_ids"
    t.index ["cart_token"], name: "index_orders_on_cart_token"
    t.index ["created_at"], name: "index_orders_on_created_at"
    t.index ["shop_id"], name: "index_orders_on_shop_id"
    t.index ["shopify_id"], name: "index_orders_on_shopify_id"
    t.index ["unique_product_ids"], name: "gin_unique_product_ids", using: :gin
  end

  create_table "partners", id: :serial, force: :cascade do |t|
    t.string "image", null: false
    t.text "description", null: false
    t.string "name", null: false
    t.string "app_url", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["app_url"], name: "index_partners_on_app_url", unique: true
    t.index ["description"], name: "index_partners_on_description", unique: true
    t.index ["name"], name: "index_partners_on_name", unique: true
  end

  create_table "pending_jobs", id: :serial, force: :cascade do |t|
    t.integer "shop_id"
    t.bigint "job_id"
    t.text "description"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "sidekiq_id"
    t.index ["shop_id"], name: "index_pending_jobs_on_shop_id"
  end

  create_table "plans", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "price_in_cents", default: 0
    t.integer "offers_limit", default: 0
    t.integer "views_limit", default: 0
    t.boolean "advanced_stats", default: false
    t.boolean "active", default: true
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.boolean "has_ajax_cart"
    t.boolean "has_customer_tags"
    t.boolean "has_ab_testing"
    t.boolean "has_branding", default: false, null: false
    t.boolean "has_offers_in_checkout", default: false
    t.boolean "has_geo_offers"
    t.boolean "has_remove_offers"
    t.boolean "has_autopilot", default: false, null: false
    t.string "stripe_id"
    t.string "internal_name"
  end

  create_table "product_companions", id: :serial, force: :cascade do |t|
    t.bigint "product_shopify_id"
    t.bigint "companion_product_shopify_id"
    t.bigint "orders", array: true
    t.integer "orders_count"
    t.index ["companion_product_shopify_id"], name: "index_product_companions_on_companion_product_shopify_id"
    t.index ["product_shopify_id"], name: "index_product_companions_on_product_shopify_id"
  end

  create_table "products", id: :serial, force: :cascade do |t|
    t.integer "shop_id"
    t.string "title"
    t.bigint "shopify_id"
    t.string "product_type"
    t.datetime "shopify_updated_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.text "image_url"
    t.text "url"
    t.jsonb "options"
    t.jsonb "variants_json"
    t.decimal "price"
    t.boolean "in_stock"
    t.jsonb "hidden_variant_shopify_ids"
    t.jsonb "images_json"
    t.bigint "recharge_discount_product_id"
    t.text "tags"
    t.string "vendor"
    t.datetime "last_synced_at", precision: nil
    t.string "sync_state"
    t.bigint "sync_job_id"
    t.datetime "next_sync_at", precision: nil
    t.string "published_status"
    t.datetime "removed_at", precision: nil
    t.jsonb "most_popular_companions"
    t.datetime "most_popular_companions_updated_at", precision: nil
    t.integer "orders_count"
    t.integer "status", default: 1
    t.index ["orders_count"], name: "index_products_on_orders_count"
    t.index ["shop_id"], name: "index_products_on_shop_id"
    t.index ["shopify_id"], name: "index_products_on_shopify_id", unique: true
    t.index ["variants_json"], name: "index_products_on_variants_json", using: :gin
  end

  create_table "refersions", id: :serial, force: :cascade do |t|
    t.string "affilitate"
    t.datetime "visited", precision: nil
    t.datetime "converted", precision: nil
    t.integer "shop_id"
    t.integer "coupon"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "revenue_events", id: :serial, force: :cascade do |t|
    t.text "description"
    t.decimal "mrr"
    t.integer "shop_id"
    t.decimal "amount"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.datetime "happened_at", precision: nil
    t.index ["shop_id"], name: "index_revenue_events_on_shop_id"
  end

  create_table "revenue_snapshots", id: :serial, force: :cascade do |t|
    t.integer "trial_amount_in_cents"
    t.integer "trial_count"
    t.integer "subscription_amount_in_cents"
    t.integer "subscription_count"
    t.date "for_date"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.jsonb "trial_data"
    t.jsonb "bucket_data"
  end

  create_table "rules", id: :serial, force: :cascade do |t|
    t.integer "offer_id"
    t.integer "item_id"
    t.string "item_type"
    t.boolean "presence"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.boolean "remove_when_offer_accepted", default: false, null: false
    t.jsonb "match_options"
    t.integer "amount"
    t.integer "quantity"
    t.string "rule_selector"
    t.string "item_name"
    t.string "item_type_name"
    t.integer "backup_id"
    t.integer "old_offer_id"
    t.string "item_stock_status"
    t.datetime "item_stock_status_updated_at", precision: nil
    t.bigint "item_shopify_id"
    t.text "item_shopify_title"
    t.index ["backup_id"], name: "unique_backup_id", unique: true
    t.index ["offer_id"], name: "index_rules_on_offer_id"
  end

  create_table "setups", id: :serial, force: :cascade do |t|
    t.integer "shop_id"
    t.jsonb "details"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["shop_id"], name: "index_setups_on_shop_id"
  end

  create_table "shop_events", id: :serial, force: :cascade do |t|
    t.integer "shop_id"
    t.string "title"
    t.text "body"
    t.decimal "revenue_impact"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["shop_id"], name: "index_shop_events_on_shop_id"
  end

  create_table "shops", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "myshopify_domain"
    t.bigint "shopify_id"
    t.string "email"
    t.string "timezone"
    t.string "iana_timezone"
    t.string "api_token"
    t.datetime "installed_at", precision: nil
    t.datetime "activated_at", precision: nil
    t.datetime "frozen_at", precision: nil
    t.datetime "uninstalled_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "finder_token"
    t.datetime "stats_synced_at", precision: nil
    t.datetime "last_synced_at", precision: nil
    t.string "money_format"
    t.datetime "last_customer_sync_at", precision: nil
    t.integer "last_sync_error_code"
    t.datetime "last_sync_error_at", precision: nil
    t.boolean "uses_ajax_cart", default: false, null: false
    t.text "custom_cart_page_dom_selector"
    t.boolean "admin", default: false, null: false
    t.string "notification_email"
    t.boolean "send_status_emails", default: true
    t.string "currency_units", default: "$", null: false
    t.text "custom_ajax_dom_selector"
    t.string "custom_ajax_dom_action"
    t.datetime "opened_at", precision: nil
    t.string "shopify_plan_name"
    t.string "custom_domain"
    t.boolean "syncing", default: false, null: false
    t.string "custom_cart_page_dom_action"
    t.string "shopify_theme_name"
    t.string "shopify_mobile_theme_name"
    t.datetime "fetched_shopify_orders_at", precision: nil
    t.boolean "use_pure_js", default: true, null: false
    t.decimal "tax_percentage"
    t.text "offer_css"
    t.boolean "can_run_on_checkout_page", default: false, null: false
    t.boolean "native_stats", default: false, null: false
    t.string "variant_price_format", default: "({{ formatted_price }})"
    t.datetime "started_wizard_at", precision: nil
    t.string "wizard_token"
    t.string "extra_css_classes"
    t.string "cart_type"
    t.datetime "wizard_completed_at", precision: nil
    t.string "custom_bg_color", default: "#ECF0F1", null: false
    t.string "custom_text_color", default: "#2B3D51", null: false
    t.string "custom_button_bg_color", default: "#2B3D51", null: false
    t.string "custom_button_text_color", default: "#ffffff", null: false
    t.jsonb "css_fields"
    t.string "platform", default: "shopify", null: false
    t.boolean "uses_ajax_refresh", default: false, null: false
    t.text "ajax_refresh_code"
    t.string "custom_cart_url"
    t.boolean "has_recharge", default: false, null: false
    t.string "currency_decimal_separator"
    t.string "currency_thousands_separator"
    t.integer "currency_decimal_places"
    t.string "currency_symbol_location"
    t.string "cdn", default: "stackpath"
    t.boolean "has_remove_offer"
    t.string "republish_status"
    t.boolean "has_geo_offers"
    t.boolean "has_autopilot"
    t.boolean "soft_purge_only"
    t.text "review"
    t.date "review_added_at"
    t.boolean "debug_mode", default: false, null: false
    t.boolean "has_custom_priorities"
    t.string "sync_state"
    t.jsonb "hidden_products_json"
    t.boolean "skip_inventory"
    t.datetime "defaults_set_at", precision: nil
    t.string "defaults_set_for"
    t.text "defaults_set_result"
    t.string "script_tag_location", default: "asyncload", null: false
    t.string "shopify_subsription_status"
    t.jsonb "shopify_subscription_history"
    t.datetime "shopify_subscription_status_updated_at", precision: nil
    t.jsonb "top_sellers"
    t.datetime "top_sellers_updated_at", precision: nil
    t.boolean "skip_resize_cart"
    t.string "js_version"
    t.string "custom_checkout_dom_selector"
    t.string "custom_checkout_dom_action"
    t.boolean "has_granular_placement"
    t.jsonb "old_offers"
    t.jsonb "feature_flags"
    t.string "stat_provider"
    t.boolean "has_multi"
    t.integer "shopify_id_bak"
    t.string "companions_status"
    t.datetime "companions_status_updated_at", precision: nil
    t.string "app", default: "incartupsell", null: false
    t.boolean "needs_checkout_adjustment", default: false, null: false
    t.datetime "script_tag_verified_at", precision: nil
    t.text "custom_theme_template"
    t.bigint "script_tag_id"
    t.text "last_refresh_result"
    t.datetime "last_refreshed_at", precision: nil
    t.text "shopify_asset_url"
    t.jsonb "css_options"
    t.boolean "adjust_dropdown_width", default: true
    t.string "shopify_plan_internal_name"
    t.boolean "has_reviewed"
    t.boolean "show_spinner"
    t.integer "builder_version"
    t.boolean "has_custom_rules"
    t.datetime "last_published_at", precision: nil
    t.string "publish_job"
    t.boolean "uses_gtm"
    t.boolean "has_custom_checkout_destination"
    t.jsonb "enabled_presentment_currencies"
    t.string "default_presentment_currency"
    t.boolean "has_redirect_to_product"
    t.boolean "has_weighted_autopilot"
    t.string "currency"
    t.string "custom_product_page_dom_selector"
    t.string "custom_product_page_dom_action"
    t.string "shopify_token"
    t.string "shopify_domain"
    t.string "access_scopes"
    t.datetime "shopify_token_updated_at", precision: nil
    t.datetime "stats_from", precision: nil
    t.string "phone_number"
    t.string "shop_domain"
    t.integer "unpublished_offer_ids", array: true
    t.boolean "activated", default: true
    t.index ["created_at"], name: "index_shops_on_created_at"
    t.index ["finder_token"], name: "index_shops_on_finder_token"
    t.index ["installed_at"], name: "index_shops_on_installed_at"
    t.index ["myshopify_domain"], name: "index_shops_on_myshopify_domain", unique: true
    t.index ["uninstalled_at"], name: "index_shops_on_uninstalled_at"
  end

  create_table "subscriptions", id: :serial, force: :cascade do |t|
    t.integer "plan_id"
    t.integer "shop_id"
    t.integer "price_in_cents"
    t.integer "offers_limit"
    t.integer "views_limit"
    t.boolean "advanced_stats"
    t.string "status"
    t.bigint "shopify_charge_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.boolean "has_ajax_cart"
    t.boolean "has_customer_tags"
    t.boolean "has_ab_testing"
    t.boolean "has_branding"
    t.integer "extra_trial_days", default: 0, null: false
    t.datetime "trial_ends_at", precision: nil
    t.boolean "has_match_options"
    t.boolean "has_discounts", default: false, null: false
    t.string "stripe_email"
    t.string "stripe_customer_token"
    t.string "platform"
    t.string "stripe_token"
    t.integer "discount_percent"
    t.bigint "shopify_charge_id_bak"
    t.date "bill_on"
    t.boolean "free_plan_after_trial"
    t.index ["plan_id"], name: "index_subscriptions_on_plan_id"
    t.index ["shop_id"], name: "index_subscriptions_on_shop_id"
  end

  create_table "sync_results", id: :serial, force: :cascade do |t|
    t.integer "shop_id"
    t.integer "active_offers_count"
    t.jsonb "active_offer_ids"
    t.jsonb "offerable_products"
    t.jsonb "offerable_collections"
    t.jsonb "rule_products"
    t.jsonb "rule_collections"
    t.decimal "elapsed_time_seconds"
    t.integer "result_code"
    t.text "result_message"
    t.boolean "republished"
    t.integer "republish_result_code"
    t.text "republish_message"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.jsonb "updated_products"
    t.jsonb "updated_collections"
    t.jsonb "missing_products"
    t.jsonb "missing_collections"
    t.index ["shop_id"], name: "index_sync_results_on_shop_id"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "body"
    t.integer "customer_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "shop_id"
    t.index ["customer_id"], name: "index_tags_on_customer_id"
    t.index ["shop_id"], name: "index_tags_on_shop_id"
  end

  create_table "themes", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "settings_asset_file"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.boolean "active", default: false, null: false
    t.string "cart_type_path"
    t.text "ajax_refresh_code"
    t.text "css"
  end

  create_table "usage_charges", id: :serial, force: :cascade do |t|
    t.integer "subscription_id"
    t.integer "amount_cents"
    t.string "result"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "shopify_id"
  end

  create_table "webhooks_passed_and_rejected_count", primary_key: "shopify_domain", id: :string, force: :cascade do |t|
    t.bigint "passed_webhooks_count", default: 0, null: false
    t.bigint "rejected_webhooks_count", default: 0, null: false
  end

  add_foreign_key "collections", "shops"
  add_foreign_key "customers", "shops"
  add_foreign_key "offer_events", "offers"
  add_foreign_key "offer_stats", "offers"
  add_foreign_key "offers", "products"
  add_foreign_key "offers", "shops"
  add_foreign_key "pending_jobs", "shops"
  add_foreign_key "products", "shops"
  add_foreign_key "rules", "offers"
  add_foreign_key "setups", "shops"
  add_foreign_key "shop_events", "shops"
  add_foreign_key "subscriptions", "plans"
  add_foreign_key "subscriptions", "shops"
  add_foreign_key "tags", "customers"
end
