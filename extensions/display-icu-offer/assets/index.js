var current_shop = null;
var current_offer = null;
let isAnAjaxCall = null;
let offerVariant = null;
let cart_contents = [];
let cart_token = '';

//This method is used to get shop and call the offers method.
const shop = async function() {
  const shopUrl = window.location.host
  debugger;
  fetch(
    `apps/proxy/shop_info?shop=${shopUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
  )
  .then(function (response) { 
    return response.json()
  })
  .then(function(data) {
    debugger;
    console.log(data)
    current_shop = data;
    offers();
  })
  .catch(function(error) {
    debugger;
    console.log(error)
  })
}


//This method is used to get offers and then call load_multi_layout method.
const offers = async function() {
  const shopUrl = window.location.host
  fetch(
    `/apps/proxy/get_all_offers?shop=${shopUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
  )
  .then(function (response) { 
    return response.json()
  })
  .then(function(data) {
    console.log(data)
    debugger;
    fetchCart();
    load_Multi_Layout(data.data);
  })
  .catch(function(error) {
    console.log(error)
  })
}


//This method will check for the respective view to render and render it.
const load_Multi_Layout = (allOffers) => {
  debugger;
  var offer_to_inject = null;
  var valid_offers = [];
  var num = 0;
  var temp_class = null;
  for (var i = 0; i < allOffers.length; i++) {
    if (allOffers[i].offer.active == true) {
      valid_offers[num++] = allOffers[i];
    }
  }
  offer_to_inject = valid_offers[Math.floor(Math.random() * valid_offers.length)];
  if (offer_to_inject != null && offer_to_inject.offerable_product_details.length > 0) {
    offerVariant = (offer_to_inject.offer.offer_text_alt.length > 0 || offer_to_inject.offer.offer_cta_alt.length > 0) ? (Math.floor(Math.random() * 2) === 0 ? 'a' : 'b') : 'a';
    current_offer = offer_to_inject;
    if(offer_to_inject.offer.multi_layout == "flex") {
      $("#template-single-compact").remove();
    }
    else if (offer_to_inject.offer.multi_layout == "compact") {
      load_single_compact__Layout(offer_to_inject);
    }
  }
  else {
    $("#template-multi-flex").remove();
    $("#template-single-compact").remove();
  }
}



//This method will load the single compact layout.
const load_single_compact__Layout = (offer_to_inject) => {
  $("#template-multi-flex").remove();
  $("#nudge-offer-compact").attr("class", $("#nudge-offer-compact").attr("class")+" "+offer_to_inject.offer.theme);
  if (offer_to_inject.offer.show_product_image == true) {
    $("#nudge-offer-compact").attr("class", $("#nudge-offer-compact").attr("class")+" with-image");
  }
  else {}

  $("#nudge-offer-compact").attr("class", $("#nudge-offer-compact").attr("class")+" multi");
  $("#nudge-offer-compact").attr("class", $("#nudge-offer-compact").attr("class")+" "+offer_to_inject.offer.multi_layout);

  if (!offer_to_inject.offerable_product_details) {
    // document.getElementById("offerable-product-details-compact-").remove();
  }
  else {
    var current_div = null;
    var clone = null;
    $("#product-image-wrapper-compact-").attr("id", `product-image-wrapper-compact-${1}`);
    $("#link-to-product-image-compact-").attr("id", `link-to-product-image-compact-${1}`);
    $("#link-to-product-title-compact-").attr("id", `link-to-product-title-compact-${1}`);
    $("#product-image-compact-").attr("id", `product-image-compact-${1}`);
    $("#nudge-wrapper-compact-").attr("id", `nudge-wrapper-compact-${1}`);
    $("#offer-text-compact-").attr("id", `offer-text-compact-${1}`);
    $("#product-title-compact-").attr("id", `product-title-compact-${1}`);
    $("#comparable-price-compact-").attr("id", `comparable-price-compact-${1}`);
    $("#product-price-compact-").attr("id", `product-price-compact-${1}`);
    $("#product-actions-compact-").attr("id", `product-actions-compact-${1}`);
    $("#custom-field-compact-first-").attr("id", `custom-field-compact-first-${1}`);
    $("#custom-field-compact-second-").attr("id", `custom-field-compact-second-${1}`);
    $("#custom-field-compact-third-").attr("id", `custom-field-compact-third-${1}`);
    $("#variants-wrapper-compact-").attr("id", `variants-wrapper-compact-${1}`);
    $("#product-select-compact-").attr("id", `product-select-compact-${1}`);
    $("#product-select-compact-single-").attr("id", `product-select-compact-single-${1}`);
    $("#single-variant-price-compact-").attr("id", `single-variant-price-compact-${1}`);
    $("#single-variant-price-compact-text-").attr("id", `single-variant-price-compact-text-${1}`);
    $("#quantity-wrapper-compact-").attr("id", `quantity-wrapper-compact-${1}`);
    $("#quantity-select-compact-").attr("id", `quantity-select-compact-${1}`);
    $("#single-quantity-select-compact-").attr("id", `single-quantity-select-compact-${1}`);
    $("#interval-unit-input-compact-").attr("id", `interval-unit-input-compact-${1}`);
    $("#interval-frequency-input-compact-").attr("id", `interval-frequency-input-compact-${1}`);
    $("#recharge-subscription-id-input-compact-").attr("id", `recharge-subscription-id-input-compact-${1}`);
    $("#submit-button-compact-").attr("id", `submit-button-compact-${1}`);
    $("#submit-input-compact-").attr("id", `submit-input-compact-${1}`);
    for (var i = 1; i < offer_to_inject.offerable_product_details.length; i++) {                                          // loop to add multiple offerable products if they exists for single offer.
      current_div_1 = document.querySelector(`#product-image-wrapper-compact-${i}`);
      clone_1 = current_div_1.cloneNode(true);
      clone_1.removeAttribute("id");
      clone_1.setAttribute("id", `product-image-wrapper-compact-${i+1}`);      
      clone_1.querySelector(`#product-image-compact-${i}`).setAttribute("id", `product-image-compact-${i+1}`);
      clone_1.querySelector(`#link-to-product-image-compact-${i}`).setAttribute("id", `link-to-product-image-compact-${i+1}`);
      $(`#nudge-offer-compact`).append(clone_1);

      current_div_2 = document.querySelector(`#nudge-wrapper-compact-${i}`);
      clone_2 = current_div_2.cloneNode(true);
      clone_2.removeAttribute("id");
      clone_2.setAttribute("id", `nudge-wrapper-compact-${i+1}`);
      clone_2.querySelector(`#offer-text-compact-${i}`).setAttribute("id", `offer-text-compact-${i+1}`);
      clone_2.querySelector(`#link-to-product-title-compact-${i}`).setAttribute("id", `link-to-product-title-compact-${i+1}`);
      clone_2.querySelector(`#product-title-compact-${i}`).setAttribute("id", `product-title-compact-${i+1}`);
      clone_2.querySelector(`#comparable-price-compact-${i}`).setAttribute("id", `comparable-price-compact-${i+1}`);
      clone_2.querySelector(`#product-price-compact-${i}`).setAttribute("id", `product-price-compact-${i+1}`);
      clone_2.querySelector(`#product-actions-compact-${i}`).setAttribute("id", `product-actions-compact-${i+1}`);
      clone_2.querySelector(`#custom-field-compact-first-${i}`).setAttribute("id", `custom-field-compact-first-${i+1}`);
      clone_2.querySelector(`#custom-field-compact-second-${i}`).setAttribute("id", `custom-field-compact-second-${i+1}`);
      clone_2.querySelector(`#custom-field-compact-third-${i}`).setAttribute("id", `custom-field-compact-third-${i+1}`);
      clone_2.querySelector(`#variants-wrapper-compact-${i}`).setAttribute("id", `variants-wrapper-compact-${i+1}`);
      clone_2.querySelector(`#product-select-compact-${i}`).setAttribute("id", `product-select-compact-${i+1}`);
      clone_2.querySelector(`#product-select-compact-single-${i}`).setAttribute("id", `product-select-compact-single-${i+1}`);
      clone_2.querySelector(`#single-variant-price-compact-${i}`).setAttribute("id", `single-variant-price-compact-${i+1}`);
      clone_2.querySelector(`#single-variant-price-compact-text-${i}`).setAttribute("id", `single-variant-price-compact-text-${i+1}`);
      clone_2.querySelector(`#quantity-wrapper-compact-${i}`).setAttribute("id", `quantity-wrapper-compact-${i+1}`);
      clone_2.querySelector(`#quantity-select-compact-${i}`).setAttribute("id", `quantity-select-compact-${i+1}`);
      clone_2.querySelector(`#single-quantity-select-compact-${i}`).setAttribute("id", `single-quantity-select-compact-${i+1}`);

      clone_2.querySelector(`#interval-unit-input-compact-${i}`).setAttribute("id", `interval-unit-input-compact-${i+1}`);
      clone_2.querySelector(`#interval-frequency-input-compact-${i}`).setAttribute("id", `interval-frequency-input-compact-${i+1}`);
      clone_2.querySelector(`#recharge-subscription-id-input-compact-${i}`).setAttribute("id", `recharge-subscription-id-input-compact-${i+1}`);

      clone_2.querySelector(`#submit-button-compact-${i}`).setAttribute("id", `submit-button-compact-${i+1}`);
      clone_2.querySelector(`#submit-input-compact-${i}`).setAttribute("id", `submit-input-compact-${i+1}`);
      $(`#nudge-offer-compact`).append(clone_2);
    }
  }

  for (var i = 0; i < offer_to_inject.offerable_product_details.length; i++) {                                            // loop to add data to multiple offerable products if exists otherwise to only one offerable product.
    if (offerVariant == 'b') {
      $(`#offer-text-compact-${i+1}`).html(offer_to_inject.offer.offer_text_alt.replace("{{ product_title }}", offer_to_inject.offerable_product_details[i].title));  
    }
    else {
      $(`#offer-text-compact-${i+1}`).html(offer_to_inject.offer.offer_text.replace("{{ product_title }}", offer_to_inject.offerable_product_details[i].title));
    }
    if (offer_to_inject.offer.show_product_image == false) {                                                                // condition to check, have to display offer image or not
      $(`#product-image-wrapper-compact-${i+1}`).css("display", "none");
    }
    else {
      $(`#product-image-compact-${i+1}`).attr("src", "//"+offer_to_inject.offerable_product_details[i].medium_image_url);
      $(`#product-image-compact-${i+1}`).attr("class", $(`#product-image-compact-${i+1}`).attr("class")+" "+offer_to_inject.offer.product_image_size);
      if (offer_to_inject.offer.product_image_size == 'small') {                                    //condition to set width of offer image because this height and width existance check is in liquid lannguage.
        $(`#product-image-compact-${i+1}`).css("width", 60);
      }
      else if (offer_to_inject.offer.product_image_size == 'medium') {
        $(`#product-image-compact-${i+1}`).css("width", 100);
      }
      else if (offer_to_inject.offer.product_image_size == 'big') {
        $(`#product-image-compact-${i+1}`).css("width", 175);
      }
      else if (offer_to_inject.offer.product_image_size == 'huge') {
       $(`#product-image-compact-${i+1}`).css("width", 350);
      }
      else {
        $(`#product-image-compact-${i+1}`).css("width", "auto");
      }
    }
    if (offer_to_inject.offer.link_to_product == true && offer_to_inject.offer.show_product_image == true && (offer_to_inject.offer.show_product_price == false && offer_to_inject.offer.show_product_title == false)) {                                              // condition to add anchor tag with address if image is visible and title and price is not visible
      $(`#link-to-product-image-compact-${i+1}`).attr("href", '/products/'+offer_to_inject.offerable_product_details[i].url); 
      $(`#link-to-product-title-compact-${i+1}`).attr("href", "javascript:void(0)");
      $(`#link-to-product-title-compact-${i+1}`).css("color", "inherit");
      $(`#link-to-product-title-compact-${i+1}`).css("cursor", "default");
      $(`#link-to-product-title-compact-${i+1}`).css("textDecoration", "none");
    }
    else if (offer_to_inject.offer.link_to_product == true && offer_to_inject.offer.show_product_image == false && (offer_to_inject.offer.show_product_price == true || offer_to_inject.offer.show_product_title == true)) {                                          // condition to add anchor tag with address if image is not visible and title or price is visible
      $(`#link-to-product-title-compact-${i+1}`).attr("href", '/products/'+offer_to_inject.offerable_product_details[i].url);
      $(`#link-to-product-image-compact-${i+1}`).attr("href", "javascript:void(0)");
      $(`#link-to-product-image-compact-${i+1}`).css("color", "inherit");
      $(`#link-to-product-image-compact-${i+1}`).css("cursor", "default");
      $(`#link-to-product-image-compact-${i+1}`).css("textDecoration", "none");
    }
    else if (offer_to_inject.offer.link_to_product == true && offer_to_inject.offer.show_product_image == true && (offer_to_inject.offer.show_product_price == true || offer_to_inject.offer.show_product_title == true)) {                                          // condition to add anchor tag with address if image is visible and title or price is visible
      $(`#link-to-product-image-compact-${i+1}`).attr("href", '/products/'+offer_to_inject.offerable_product_details[i].url);
      $(`#link-to-product-title-compact-${i+1}`).attr("href", '/products/'+offer_to_inject.offerable_product_details[i].url);
    }
    else {
      $(`#link-to-product-image-compact-${i+1}`).attr("href", "javascript:void(0)");
      $(`#link-to-product-image-compact-${i+1}`).css("color", "inherit");
      $(`#link-to-product-image-compact-${i+1}`).css("cursor", "default");
      $(`#link-to-product-image-compact-${i+1}`).css("textDecoration", "none");
      $(`#link-to-product-title-compact-${i+1}`).attr("href", "javascript:void(0)");
      $(`#link-to-product-title-compact-${i+1}`).css("color", "inherit");
      $(`#link-to-product-title-compact-${i+1}`).css("cursor", "default");
      $(`#link-to-product-title-compact-${i+1}`).css("textDecoration", "none");
    }
    if (offer_to_inject.offer.show_product_title == true) {                                     // condition to check, have to display product title or not
      $(`#product-title-compact-${i+1}`).html(offer_to_inject.offerable_product_details[i].title);
      if (offer_to_inject.offer.show_product_price == true) {
        $(`#product-title-compact-${i+1}`).append(":");
      }
      else {}
    }
    else {}

    if (offer_to_inject.offer.show_product_price == true) {                                     // condition to check have to display price or not
      $(`#product-price-compact-${i+1}`).html(offer_to_inject.offerable_product_details[i].available_json_variants[0].unparenthesized_price);
      if (offer_to_inject.offer.show_compare_at_price == true) {                                  // condition to check, have to display compare_at_price or not
        if (offer_to_inject.offerable_product_details[i].available_json_variants[0].price_is_minor_than_compare_at_price == true) {                                         // condition to check if price is less than the comparable price
          $(`#comparable-price-compact-${i+1}`).html(offer_to_inject.offerable_product_details[i].available_json_variants[0].compare_at_price);
        }
        else {}
      }
      else {}
    }
    else {}

  }
  
  if (offer_to_inject.offer.show_nothanks == false) {                                                                  // condition to check have to display offer or not
    $("#dismiss-button-compact").css("display", "none");
  }
  else {}

  load_single_compact_Layout_form(offer_to_inject);
}



//This method will load the form of single compact layout.
const load_single_compact_Layout_form = (offer_to_inject) => {
  var x = null;
  var option = null;
  for (var i = 0; i < offer_to_inject.offerable_product_details.length ;i++) {
    offer_to_inject.offerable_product_details[i].available_json_variants = offer_to_inject.offerable_product_details[i].available_json_variants.filter(function(elt)
    {
    return offer_to_inject.offer.included_variants[offer_to_inject.offerable_product_details[i].id].includes(elt.id);
    });
    if (offer_to_inject.offerable_product_details[i].available_json_variants.length > 1) {
      for (var j = 0; j < offer_to_inject.offerable_product_details[i].available_json_variants.length; j++) {
        if (offer_to_inject.offer.show_variant_price == true) {
          x = document.getElementById(`product-select-compact-${i+1}`);
          option = document.createElement("option");
          option.text = offer_to_inject.offerable_product_details[i].available_json_variants[j].title+" "+offer_to_inject.offerable_product_details[i].available_json_variants[j].price;
          option.value = offer_to_inject.offerable_product_details[i].available_json_variants[j].id;
          option.setAttribute("data_image_url", offer_to_inject.offerable_product_details[i].available_json_variants[j].image_url);
          option.setAttribute("data_variant_compare_at_price", offer_to_inject.offerable_product_details[i].available_json_variants[j].compare_at_price);
          option.setAttribute("data_variant_price", offer_to_inject.offerable_product_details[i].available_json_variants[j].unparenthesized_price);
          option.setAttribute("offerable_product_details_index", i+1);
          option.setAttribute("available_json_variants_index", j+1);
          option.setAttribute("show_product_price", offer_to_inject.offer.show_product_price);
          option.setAttribute("show_compare_at_price", offer_to_inject.offer.show_compare_at_price);
          option.setAttribute("price_is_minor_than_compare_at_price", offer_to_inject.offerable_product_details[i].available_json_variants[j].price_is_minor_than_compare_at_price);
          for (var k = 0; k < offer_to_inject.offerable_product_details[i].available_json_variants[j].currencies.length; k++) {
            var data_variant_price = null;
            var data_variant_compare_at_price = null;
            data_variant_price = "data_variant_price_"+offer_to_inject.offerable_product_details[i].available_json_variants[j].currencies[k].label;
            data_variant_compare_at_price = "data_variant_compare_at_price_"+offer_to_inject.offerable_product_details[i].available_json_variants[j].currencies[k].label;
            option.setAttribute(data_variant_price, offer_to_inject.offerable_product_details[i].available_json_variants[j].currencies[k].price);
            option.setAttribute(data_variant_compare_at_price, offer_to_inject.offerable_product_details[i].available_json_variants[j].currencies[k].compare_at_price);
          }
          x.add(option);
        }
        else {
          x = document.getElementById(`product-select-compact-${i+1}`);
          option = document.createElement("option");
          option.text = offer_to_inject.offerable_product_details[i].available_json_variants[j].title;
          option.value = offer_to_inject.offerable_product_details[i].available_json_variants[j].id;
          option.setAttribute("data_image_url", offer_to_inject.offerable_product_details[i].available_json_variants[j].image_url);
          option.setAttribute("data_variant_compare_at_price", offer_to_inject.offerable_product_details[i].available_json_variants[j].compare_at_price);
          option.setAttribute("data_variant_price", offer_to_inject.offerable_product_details[i].available_json_variants[j].unparenthesized_price);
          option.setAttribute("offerable_product_details_index", i+1);
          option.setAttribute("available_json_variants_index", j+1);
          option.setAttribute("show_product_price", offer_to_inject.offer.show_product_price);
          option.setAttribute("show_compare_at_price", offer_to_inject.offer.show_compare_at_price);
          option.setAttribute("price_is_minor_than_compare_at_price", offer_to_inject.offerable_product_details[i].available_json_variants[j].price_is_minor_than_compare_at_price);
          for (var k = 0; k < offer_to_inject.offerable_product_details[i].available_json_variants[j].currencies.length; k++) {
            var data_variant_price = null;
            var data_variant_compare_at_price = null;
            data_variant_price = "data_variant_price_"+offer_to_inject.offerable_product_details[i].available_json_variants[j].currencies[k].label;
            data_variant_compare_at_price = "data_variant_compare_at_price_"+offer_to_inject.offerable_product_details[i].available_json_variants[j].currencies[k].label;
            option.setAttribute(data_variant_price, offer_to_inject.offerable_product_details[i].available_json_variants[j].currencies[k].price);
            option.setAttribute(data_variant_compare_at_price, offer_to_inject.offerable_product_details[i].available_json_variants[j].currencies[k].compare_at_price);
          }
          x.add(option);
        }
      }
      document.getElementById(`single-variant-price-compact-${i+1}`).remove();
    }
    else {
      if (offer_to_inject.offer.show_variant_price == true && offer_to_inject.offerable_product_details[i].hide_variants_wrapper == true && offer_to_inject.offerable_product_details[i].available_json_variants.length == 1) {
        x = document.getElementById(`product-select-compact-single-${i+1}`);
        option = document.createElement("option");
        option.text = offer_to_inject.offerable_product_details[i].available_json_variants[0].title+" "+offer_to_inject.offerable_product_details[i].available_json_variants[0].price;
        option.value = offer_to_inject.offerable_product_details[i].available_json_variants[0].id;
        option.setAttribute("data_image_url", offer_to_inject.offerable_product_details[i].available_json_variants[0].image_url);
        option.setAttribute("data_variant_compare_at_price", offer_to_inject.offerable_product_details[i].available_json_variants[0].compare_at_price);
        option.setAttribute("data_variant_price", offer_to_inject.offerable_product_details[i].available_json_variants[0].unparenthesized_price);
        option.setAttribute("offerable_product_details_index", i+1);
        option.setAttribute("available_json_variants_index", j+1);
        option.setAttribute("show_product_price", offer_to_inject.offer.show_product_price);
        option.setAttribute("show_compare_at_price", offer_to_inject.offer.show_compare_at_price);
        option.setAttribute("price_is_minor_than_compare_at_price", offer_to_inject.offerable_product_details[i].available_json_variants[0].price_is_minor_than_compare_at_price);
        for (var k = 0; k < offer_to_inject.offerable_product_details[i].available_json_variants[0].currencies.length; k++) {
          var data_variant_price = null;
          var data_variant_compare_at_price = null;
          data_variant_price = "data_variant_price_"+offer_to_inject.offerable_product_details[i].available_json_variants[0].currencies[k].label;
          data_variant_compare_at_price = "data_variant_compare_at_price_"+offer_to_inject.offerable_product_details[i].available_json_variants[0].currencies[k].label;
          option.setAttribute(data_variant_price, offer_to_inject.offerable_product_details[i].available_json_variants[0].currencies[k].price);
          option.setAttribute(data_variant_compare_at_price, offer_to_inject.offerable_product_details[i].available_json_variants[0].currencies[k].compare_at_price);
        }
        x.add(option);

        $(`#product-select-compact-single-${i+1}`).css("display", "none");
        $(`#single-variant-price-compact-text-${i+1}`).html(offer_to_inject.offerable_product_details[i].available_json_variants[0].unparenthesized_price);
        $(`#variants-wrapper-compact-${i+1}`).css("display", "none");
      }
      else {
        $(`#single-variant-price-compact-${i+1}`).remove();
        $(`#variants-wrapper-compact-${i+1}`).css("display", "none");
      }
    }
    if (offer_to_inject.offer.show_quantity_selector == false) {
      $(`#quantity-wrapper-compact-${i+1}`).css("display", "none");
    }
    else {
      $(`#single-quantity-select-compact-${i+1}`).remove();
    }

    if (offer_to_inject.offer.show_custom_field == true) {
      $(`#custom-field-compact-first-${i+1}`).attr("placeholder", offer_to_inject.offer.custom_field_name);
      $(`#custom-field-compact-first-${i+1}`).attr("name", `properties[${offer_to_inject.offer.custom_field_name}]`);
      if (offer_to_inject.offer.custom_field_2_name == null || offer_to_inject.offer.custom_field_2_name == "") {
        $(`#custom-field-compact-second-${i+1}`).remove();
      }
      else {
        $(`#custom-field-compact-second-${i+1}`).attr("placeholder", offer_to_inject.offer.custom_field_2_name);
        $(`#custom-field-compact-second-${i+1}`).attr("name", `properties[${offer_to_inject.offer.custom_field_2_name}]`);
      }
      if (offer_to_inject.offer.custom_field_3_name == null || offer_to_inject.offer.custom_field_3_name == "") {
        $(`#custom-field-compact-third-${i+1}`).remove();
      }
      else {
        $(`#custom-field-compact-third-${i+1}`).attr("placeholder", offer_to_inject.offer.custom_field_3_name);
        $(`#custom-field-compact-third-${i+1}`).attr("name", `properties[${offer_to_inject.offer.custom_field_3_name}]`);
      }
    }
    else {
      $(`#custom-field-compact-first-${i+1}`).remove();
      $(`#custom-field-compact-second-${i+1}`).remove();
      $(`#custom-field-compact-third-${i+1}`).remove();
    }

    // const current_shop = shop();
    if(offer_to_inject.offer.recharge_subscription_id == null) {
      $(`#interval-unit-input-compact-${i+1}`).remove();
      $(`#interval-frequency-input-compact-${i+1}`).remove();
      $(`#recharge-subscription-id-input-compact-${i+1}`).remove();
    }
    else {
      $(`#interval-unit-input-compact-${i+1}`).attr("name", `properties[${offer_to_inject.offer.interval_unit}]`);
      $(`#interval-frequency-input-compact-${i+1}`).attr("name", `properties[${offer_to_inject.offer.interval_frequency}]`);
      $(`#recharge-subscription-id-input-compact-${i+1}`).attr("name", `properties[${offer_to_inject.offer.recharge_subscription_id}]`);

      $(`#interval-unit-input-compact-${i+1}`).val(offer_to_inject.offer.interval_unit);
      $(`#interval-frequency-input-compact-${i+1}`).val(offer_to_inject.offer.interval_frequency);
      $(`#recharge-subscription-id-input-compact-${i+1}`).val(offer_to_inject.offer.recharge_subscription_id);
    }
    if(current_shop.shop.show_spinner == true) {
      $(`#submit-input-compact-${i+1}`).remove();
      if(offerVariant == 'b') {
        $(`#submit-button-compact-${i+1}`).html(offer_to_inject.offer.offer_cta_alt);
      }
      else {
        $(`#submit-button-compact-${i+1}`).html(offer_to_inject.offer.offer_cta);
      }
    }
    else {
      $(`#submit-button-compact-${i+1}`).remove();
      if (offerVariant == 'b') {
        $(`#submit-input-compact-${i+1}`).val(offer_to_inject.offer.offer_cta_alt);
      }
      else {
        $(`#submit-input-compact-${i+1}`).val(offer_to_inject.offer.offer_cta);
      }
    }
  }
}


//This method is used to change the variant of the offerable products.
const changeJsonVariant = (selectedVariant) => {
  var offerable_product_details_index = parseInt(selectedVariant.options[selectedVariant.selectedIndex].getAttribute("offerable_product_details_index"));
  var available_json_variants_index = parseInt(selectedVariant.options[selectedVariant.selectedIndex].getAttribute("available_json_variants_index"));
  var show_product_price = selectedVariant.options[selectedVariant.selectedIndex].getAttribute("show_product_price");
  var show_compare_at_price = selectedVariant.options[selectedVariant.selectedIndex].getAttribute("show_compare_at_price");
  var price_is_minor_than_compare_at_price = selectedVariant.options[selectedVariant.selectedIndex].getAttribute("price_is_minor_than_compare_at_price");

  if (show_product_price == "true") {                                     // condition to check have to display price or not
    $(`#product-price-compact-${offerable_product_details_index}`).html(selectedVariant.options[selectedVariant.selectedIndex].getAttribute("data_variant_price"));
    if (show_compare_at_price == "true") {                                  // condition to check, have to display compare_at_price or not
      if (price_is_minor_than_compare_at_price == "true") {                                         // condition to check if price is less than the comparable price
        $(`#comparable-price-compact-${offerable_product_details_index}`).html(selectedVariant.options[selectedVariant.selectedIndex].getAttribute("data_variant_compare_at_price"));
      }
      else {}
    }
    else {}
  }
  else {}
}


//This method is called when cross is clicked.
const dismissOfferCompact = () => {
  $("#nudge-offer-compact").remove();
}


//This method fetch data from the cart.
const fetchCart = () => {
  fetch(`${current_shop.path_to_cart}.json?icu=1`)
    .then(function(response) { return response.json(); })
    .then(function(data) {
      // raw_cart = data;
      assignDataToCart(data);
    });
}


const assignDataToCart = (data) => {
  cart_contents = data.items.map((item) => {
    let p = {
      product:  item.product_id,
      variant:  item.variant_id,
      options:  item.variant_options,
      price:    item.line_price,
      quantity: item.quantity,
      vendor:   item.vendor,
     };
     if (item.properties && item.properties.subscription_id) {
       p.recharge_id = item.properties.subscription_id;
     }
    return p;
  });

  cart_total_price = data.total_price;
  cart_token       = data.token;
}




shop();



//This method is called when the offer is accepted.
const acceptShopifyOffer = (form) => {
  let offerable_product = parseInt(form.id.at(-1));
  
  if (!customFields(current_offer.offer, offerable_product)) {
    return true;
  }


  //Disabled the input button to prevent double click.
  let btn = $(form).find('.bttn')
  btn.attr('disabled',true);
  //Optionally replace the button with a spinner
  if (current_shop.shop.show_spinner) {
    showSpiner(btn);
  }
  else {
    console.log("not showing spinner");
  }

  //record that the offer was accepted
  if(current_shop.shop.uses_ajax_cart == true && current_offer.offer.in_ajax_cart == true) {
    isAnAjaxCall = true;
  }
  let selectedShopifyVariant = $(form).find(":selected").val();
  let called_method = isAnAjaxCall ? 'ajax' : 'regular';
  let current_page  = isAnAjaxCall ? 'ajax' : currentPage();
  let opts = {
    action: "click",
    offerId: current_offer.offer.id,
    offerVariant: offerVariant,  // test ab data
    selectedShopifyVariant: selectedShopifyVariant,
    cart_token: cart_token,
    page: current_page,
    method: called_method
  };

  doAcceptShopifyOffer(selectedShopifyVariant, form);
}


//This method is used to add offer to cart
const doAcceptShopifyOffer = (selectedShopifyVariant, form) => {
  let quantityToAdd = getQuantity(form);
  if(current_offer.offer.redirect_to_product) {
    redirectToProductPage(selectedShopifyVariant);
    return;
  }

  // if(isValidCheckoutPage(current_shop.can_run_on_checkout_page)) {
  if (true) {
    addVariantToCartUsingURL(selectedShopifyVariant, current_offer.offer.discount_code);
    return;
  }
};

// Only when we are on the CheckoutPage
const addVariantToCartUsingURL = (variantId, discountCode) => {
  var strCart = "";
  var variantAlreadyInCart = false;
  for (var i = 0; i < cart_contents.length; i++) {
    if (strCart.length > 0) { strCart += ","; }
    var qty = cart_contents[i].quantity;
    if (cart_contents[i].variant == variantId) {
      qty += 1;
      variantAlreadyInCart = true;
    }
    strCart += cart_contents[i].variant + ":" + qty;
  }
  if (!variantAlreadyInCart) {
    strCart += "," + variantId + ":1";
  }
  if (discountCode === false) {
    document.location = "https://" + current_shop.shop.shopify_domain + "/cart/" + strCart;
  } else {
    fetch(
      "/discount/" + encodeURIComponent(discountCode), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      }
    )
    .then(function(response) { return response.json(); })
    .then(function(data) {
      document.location = "https://" + current_shop.shop.shopify_domain + "/cart/" + strCart;
    });

    // Zepto.ajax({
    //   type: "GET",
    //   global: false,
    //   url: "/discount/" + encodeURIComponent(discountCode),
    //   complete: function () {
    //     document.location = "https://" + settings.shop.shopify_domain + "/cart/" + strCart;
    //   }
    // });
  }
};








































// Helper Section.
























const customFields = (offer, offerable_product) => {
  if(!offer.show_custom_field) {
    return true;
  }

  if (offer.custom_field_name && offer.custom_field_required) {
    let input_1 = $(`#custom-field-compact-first-${offerable_product}`);
    let customFieldValue = input_1.value;
    if (!customFieldValue) {
      return false;
    }
  }

  if (offer.custom_field_2_name && offer.custom_field_2_required) {
    let input_2 = $(`#custom-field-compact-first-${offerable_product}`);
    let customFieldValue = input_2.value;
    if (!customFieldValue) {
      return false;
    }
  }

  if (offer.custom_field_3_name && offer.custom_field_3_required) {
    let input_3 = $(`#custom-field-compact-first-${offerable_product}`);
    let customFieldValue = input_3.value;
    if (!customFieldValue) {
      return false;
    }
  }

  return true;
};



const showSpiner = (btn) => {
  let myHeight = btn.height() - parseInt(btn.css("padding-top")) - parseInt(btn.css("padding-bottom"));
    if ((btn.parent().width() - btn.width()) >= 50) {
      const myPadding = (btn.width() - myHeight) / 2;
      btn.css("padding-left", `${myPadding}px`);
      btn.css("padding-right", `${myPadding}px`);
    }
    let spiner_code = spinerCode(myHeight);
    btn.html(spiner_code);
};

const spinerCode = (myHeight) => {
  let strCode = `<svg style='width: ${myHeight}px; height: ${myHeight}px; vertical-align: bottom;
   animation-name: incartupsellspin; animation-duration: 2000ms; animation-iteration-count: infinite;
   animation-timing-function: linear;' aria-hidden='true' focusable='false' data-prefix='fas'
   data-icon='circle-notch' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
   <path fill='currentColor' d='M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z' class=''></path></svg>`;
  return strCode;
};


const getQuantity = (form) => {
  let quantity = $(form).find('[name=quantity]').val();
  return quantity || 1;
}

//Method to redirect to selected product
const redirectToProductPage = (selectedShopifyVariant) => {
  let current_product;
  for (let i=0;i< current_offer.offerable_product_details.length; i++) {
    for (let j=0; j < current_offer.offerable_product_details[i].available_json_variants.length; j++) {
      if (parseInt(current_offer.offerable_product_details[i].available_json_variants[j].id) == parseInt(selectedShopifyVariant)) {
          current_product = current_offer.offerable_product_details[i];
          break;
        }
      }
  }
  if (!current_product) {

  } else {
    let utmString = $.param({
      utm_source: "shop",
      utm_medium: current_shop.canonical_domain,
      utm_campaign: "upsell",
      utm_content: current_product.title
    });
    document.location = `/products/${current_product.url}?${utmString}`;
    return;
  }
}








































// Page Section






















const currentPage = () => {
  if (isCartPage()) {
    return "cart";
  } else if (isProductPage()) {
    return "product";
  } else {
    return "ajax";
  }
};


const isCartPage = () => {
  return /\/cart\/?$/.test(window.location.pathname);
};

const isValidCheckoutPage = (can_run_on_checkout_page) => {
  return can_run_on_checkout_page && /\/\d+\/checkouts/.test(window.location.pathname);
}

const isProductPage = () => {
  return window.location.pathname.includes("/products/");
};