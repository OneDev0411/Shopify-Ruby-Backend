module OffersHelper
  include ActionView::Helpers::NumberHelper

  def format_with_delimiters(number=0, precision=2, thousands=',', decimal='.')
    number  = "%.#{precision}f" % (number/100.0)
    parts   = number.split('.')
    # dollars = parts[0].gsub(/(\d)(?=(\d\d\d)+(?!\d))/, '$1' + thousands)
    my_digit_pattern = /(\d)(?=(\d\d\d)+(?!\d))/
    dollars = parts[0].gsub(my_digit_pattern) do |digit_to_delimit|
      "#{digit_to_delimit}#{thousands}"
    end
    cents   = parts[1] ? (decimal + parts[1]) : ''
    return dollars + cents
  end

  def formatted_variant_price(shop, price)
    scrubber = Rails::Html::TargetScrubber.new
    scrubber.tags = ['span']
    html_fragment = Loofah.fragment(shop.try(:money_format).try(:strip))
    formatString = html_fragment.scrub!(scrubber).to_s

    placeholderRegex = /\{\{\s*(\w+)\s*\}\}/
    cents = price.to_s.gsub(".","").to_i
    cents_with_tax = if shop.tax_percentage.present?
      cents + (cents * shop.tax_percentage)
    else
      cents
    end

    if formatString.match(placeholderRegex).nil?
      return number_to_currency(cents_with_tax, unit: shop.try(:currency_units))
    else

      case formatString.match(placeholderRegex)[1]
      when 'amount'
        value = format_with_delimiters(cents_with_tax, 2)
      when 'amount_no_decimals'
        value = format_with_delimiters(cents_with_tax, 0)
      when 'amount_with_comma_separator'
        value = format_with_delimiters(cents_with_tax, 2, '.', ',')
      when 'amount_no_decimals_with_comma_separator'
        value = format_with_delimiters(cents_with_tax, 0, '.', ',')
      else
        value = cents_with_tax
      end

      return formatString.gsub(placeholderRegex, value).gsub("€","&euro;")
    end
  end

  def parenthesized_variant_price(shop, price)
    formatted_price = formatted_variant_price(shop, price)
    display_format  = shop.try(:variant_price_format) || "({{ formatted_price }})"
    display_format_regex =  /\{\{\s*formatted_price\s*\}\}/
    display_format.gsub(display_format_regex, formatted_price)
  end

  def variant_price(shop, price)
    formatted_price = formatted_variant_price(shop, price)
    display_format  = shop.try(:variant_price_format).gsub("(", "").gsub(")","") || "{{ formatted_price }}"
    display_format_regex =  /\{\{\s*formatted_price\s*\}\}/
    display_format.gsub(display_format_regex, formatted_price)
  end

  def json_rule_description(obj, shopify_domain)
    sel = obj['rule_selector'] || obj['rule_type']
    url = ""
    if shopify_domain.present?
      if obj['item_type'] == 'product'
        p = Product.find_by(shopify_id: obj['item_shopify_id'])
        url = "https://#{shopify_domain}/products/#{p.try(:url)}" if p.present?
      elsif obj['item_type'] == 'collection'
        p = Collection.find_by(shopify_id: obj['item_shopify_id'])
        url = "https://#{shopify_domain}/collections/#{p.try(:handle)}" if p.present?
      end
    end
    bold_item_name = if url.blank?
                       "<strong>#{obj['item_name']}</strong>"
                     else
                       "<a href='#{url}' target='_blank'>#{obj['item_name']}</a>"
                     end
    case sel
    when "custom"
      "Custom code is TRUE: <pre style='margin-bottom: 0px; overflow-x: scroll; white-space: inherit;'>#{obj['item_name']}</pre>"
    when "cart_at_least"
      "Cart contains at least #{obj['quantity']} #{obj['item_type'] == 'product' ? '' : 'item from collection'} #{bold_item_name}"
    when "cart_exactly"
      "Cart contains exactly #{obj['quantity']} #{obj['item_type'] == 'product' ? '' : 'item from collection'} #{bold_item_name}"
    when "cart_at_most"
      "Cart contains at most #{obj['quantity']} #{obj['item_type'] == 'product' ? '' : 'item from collection'} #{bold_item_name}"
    when "cart_does_not_contain"
      if obj['item_type'] == "product"
        "Cart does not contain product #{bold_item_name}"
      elsif obj['item_type'] == "collection"
        "Cart does not contain any item from collection #{bold_item_name}"
      else
        "ERROR: please edit this rule"
      end
    when "total_at_least"
      "Order Total Is At Least #{bold_item_name} (cents)"
    when "total_at_most"
      "Order Total Is At Most #{bold_item_name} (cents)"
    when "customer_is_tagged"
      "Logged in customer is tagged #{bold_item_name}"
    when "customer_is_not_tagged"
      "Logged in customer is not tagged #{bold_item_name}"
    when "in_location"
      "Customer is located in #{bold_item_name}"
    when "not_in_location"
      "Customer is not located in #{bold_item_name}"
    when "cart_contains_recharge"
      "Cart contains recharge item #{bold_item_name}"
    when "cart_does_not_contain_recharge"
      "Cart does not contain recharge item #{bold_item_name}"
    when "cookie_is_set"
      "Cookie named #{bold_item_name} is set"
    when "cookie_is_not_set"
      "Cookie named #{bold_item_name} is not set"
    when "url_contains"
      "Cart URL contains #{bold_item_name}"
    when "url_does_not_contain"
      "Cart URL does not contain #{bold_item_name}"
    when "cart_contains_variant"
      "Cart contains variant #{bold_item_name}"
    when "cart_does_not_contain_variant"
      "Cart does not contain variant #{bold_item_name}"
   when 'on_product_this_product_or_in_collection'
     if obj['item_type'] == 'product'
       "Customer is viewing this product #{bold_item_name}"
     elsif obj['item_type'] == 'collection'
       "Customer is viewing this collection #{bold_item_name}"
     else
       "ERROR: please edit this rule"
     end
   when 'on_product_not_this_product_or_not_in_collection'
     if obj['item_type'] == 'product'
       "Customer is not viewing this product #{bold_item_name}"
     elsif obj['item_type'] == 'collection'
       "Customer is not viewing this collection #{bold_item_name}"
     else
       "ERROR: please edit this rule"
     end
   else
     (sel || '').gsub("_", " ").capitalize
    end
  end
end
