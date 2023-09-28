namespace :create_placement_setting do
  task :feed_placement_setting => :environment do
    defaultSettingsToDisplayOffer = [
      { 
        name: "Dawn",
        type: 'cart',
        action: 'before',
        selector: '#cart',
      },
      { 
        name: "Dawn",
        type: 'product',
        action: 'after',
        selector: '.product-form',
      },
      {
        name: "Dawn",
        type: 'ajax',
        action: 'before',
        selector: '.cart-notification-product',
      },
      {
        name: "Colorblock",
        type: 'cart',
        action: 'before',
        selector: '#cart',
      },
      {
        name: "Colorblock",
        type: 'product',
        action: 'before',
        selector: '.product-form',
      },
      {
        name: "Colorblock",
        type: 'ajax',
        action: 'before',
        selector: '.cart-notification-product',
      },
      {
        name: "Publisher",
        type: 'cart',
        action: 'before',
        selector: '#cart',
      },
      {
        name: "Publisher",
        type: 'product',
        action: 'after',
        selector: '.product-form',
      },
      {
        name: "Publisher",
        type: 'ajax',
        action: 'before',
        selector: '.cart-item:first',
      },
      {
        name: "Crave",
        type: 'cart',
        action: 'before',
        selector: '#cart',
      },
      {
        name: "Crave",
        type: 'product',
        action: 'after',
        selector: '.product-form',
      },
      {
        name: "Crave",
        type: 'ajax',
        action: 'before',
        selector: '.cart-notification-product',
      },
      {
        name: "Studio",
        type: 'cart',
        action: 'before',
        selector: '#cart',
      },
      {
        name: "Studio",
        type: 'product',
        action: 'after',
        selector: '.product-form',
      },
      {
        name: "Studio",
        type: 'ajax',
        action: 'before',
        selector: '.cart-notification-product',
      },
      {
        name: "Taste",
        type: 'cart',
        action: 'before',
        selector: '#cart',
      },
      {
        name: "Taste",
        type: 'product',
        action: 'after',
        selector: '.product-form',
      },
      {
        name: "Taste",
        type: 'ajax',
        action: 'before',
        selector: '.cart-notification-product',
      },
      {
        name: "Spotlight",
        type: 'cart',
        action: 'before',
        selector: '#cart',
      },
      {
        name: "Spotlight",
        type: 'product',
        action: 'after',
        selector: '.product-form',
      },
      {
        name: "Spotlight",
        type: 'ajax',
        action: 'before',
        selector: '.cart-notification-product',
      },
      {
        name: "Ride",
        type: 'cart',
        action: 'before',
        selector: '#cart',
      },
      {
        name: "Ride",
        type: 'product',
        action: 'after',
        selector: '.product-form',
      },
      {
        name: "Ride",
        type: 'ajax',
        action: 'before',
        selector: '.cart-notification-product',
      },
      {
        name: "Origin",
        type: 'cart',
        action: 'before',
        selector: '#cart',
      },
      {
        name: "Origin",
        type: 'product',
        action: 'after',
        selector: '.product-form',
      },
      {
        name: "Origin",
        type: 'ajax',
        action: 'before',
        selector: '.cart-item:first',
      },
      {
        name: "Sense",
        type: 'cart',
        action: 'before',
        selector: '.cart-items',
      },
      {
        name: "Sense",
        type: 'product',
        action: 'before',
        selector: "[class*='product__description']",
      },
      {
        name: "Sense",
        type: 'ajax',
        action: 'before',
        selector: '#cart-notification-product',
      },
      {
        name: "Craft",
        type: 'cart',
        action: 'before',
        selector: '.cart-items',
      },
      {
        name: "Craft",
        type: 'product',
        action: 'before',
        selector: "[class*='product__description']",
      },
      {
        name: "Craft",
        type: 'ajax',
        action: 'before',
        selector: '#cart-notification-product',
      },
      {
        name: "Refresh",
        type: 'cart',
        action: 'before',
        selector: '#cart',
      },
      {
        name: "Refresh",
        type: 'product',
        action: 'before',
        selector: '.product-form',
      },
      {
        name: "Refresh",
        type: 'ajax',
        action: 'prepend',
        selector: '#CartDrawer-Form',
      }
    ]

    defaultSettingsToDisplayOffer.each do |dft|
      ThemeDefaultSetting.find_or_create_by(theme_name: dft[:name], page_type: dft[:type], action: dft[:action], selector: dft[:selector])
    end

    themeSettingForTemplate = [
      {
        name: "Dawn",
        type: "cart",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        action: 'before',
        selector: '#cart'
      },
      {
        name: "Dawn",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '.cart__ctas'
      },
      {
        name: "Dawn",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '.cart__ctas'
      },
      {
        name: "Dawn",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'after',
        selector: '.product-form'
      },
      {
        name: "Dawn",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__buttons'
      },
      {
        name: "Dawn",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'before',
        selector: '.product-form__quantity'
      },
      {
        name: "Dawn",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'before',
        selector: '#cart-notification-product'
      },
      {
        name: "Dawn",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'after',
        selector: '.cart-notification-product'
      },
      {
        name: "Dawn",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'after',
        selector: '.cart-notification-product'
      },




      {
        name: "Colorblock",
        type: "cart",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        action: 'before',
        selector: '#cart'
      },
      {
        name: "Colorblock",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '.cart__ctas'
      },
      {
        name: "Colorblock",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '.cart__ctas'
      },
      {
        name: "Colorblock",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'before',
        selector: '.product-form'
      },
      {
        name: "Colorblock",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__buttons'
      },
      {
        name: "Colorblock",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'after',
        selector: '.product-form__buttons'
      },
      {
        name: "Colorblock",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'before',
        selector: '#cart-notification-product'
      },
      {
        name: "Colorblock",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'after',
        selector: '.cart-notification-product'
      },
      {
        name: "Colorblock",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'after',
        selector: '.cart-notification-product'
      },




      {
        name: "Publisher",
        type: "cart",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        action: 'before',
        selector: '#cart'
      },
      {
        name: "Publisher",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '#cart__ctas'
      },
      {
        name: "Publisher",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '#cart__ctas'
      },
      {
        name: "Publisher",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'after',
        selector: '.product-form'
      },
      {
        name: "Publisher",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__quantity'
      },
      {
        name: "Publisher",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'after',
        selector: '.product-form__quantity'
      },
      {
        name: "Publisher",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'before',
        selector: '.cart-item:first'
      },
      {
        name: "Publisher",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'prepend',
        selector: '.drawer__footer'
      },
      {
        name: "Publisher",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'prepend',
        selector: '.drawer__footer'
      },





      {
        name: "Crave",
        type: "cart",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        action: 'before',
        selector: '#cart'
      },
      {
        name: "Crave",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '.cart__ctas'
      },
      {
        name: "Crave",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '.cart__ctas'
      },
      {
        name: "Crave",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'after',
        selector: '.product-form'
      },
      {
        name: "Crave",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__buttons'
      },
      {
        name: "Crave",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'after',
        selector: '.product-form__buttons'
      },
      {
        name: "Crave",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'before',
        selector: '#cart-notification-product'
      },
      {
        name: "Crave",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'after',
        selector: '.cart-notification-product'
      },
      {
        name: "Crave",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'after',
        selector: '.cart-notification-product'
      },





      {
        name: "Studio",
        type: "cart",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        action: 'before',
        selector: '#cart'
      },
      {
        name: "Studio",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '.cart__ctas'
      },
      {
        name: "Studio",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '.cart__ctas'
      },
      {
        name: "Studio",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'after',
        selector: '.product-form'
      },
      {
        name: "Studio",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__buttons'
      },
      {
        name: "Studio",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'after',
        selector: '.product-form__buttons'
      },
      {
        name: "Studio",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'before',
        selector: '#cart-notification-product'
      },
      {
        name: "Studio",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'after',
        selector: '.cart-notification-product'
      },
      {
        name: "Studio",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'after',
        selector: '.cart-notification-product'
      },





      {
        name: "Taste",
        type: "cart",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        action: 'before',
        selector: '#cart'
      },
      {
        name: "Taste",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '.cart__ctas'
      },
      {
        name: "Taste",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '.cart__ctas'
      },
      {
        name: "Taste",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'after',
        selector: '.product-form'
      },
      {
        name: "Taste",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__buttons'
      },
      {
        name: "Taste",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'after',
        selector: '.product-form__buttons'
      },
      {
        name: "Taste",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'before',
        selector: '#cart-notification-product'
      },
      {
        name: "Taste",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'after',
        selector: '.cart-notification-product'
      },
      {
        name: "Taste",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'after',
        selector: '.cart-notification-product'
      },





      {
        name: "Spotlight",
        type: "cart",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        action: 'before',
        selector: '#cart'
      },
      {
        name: "Spotlight",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '.cart__ctas'
      },
      {
        name: "Spotlight",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '.cart__ctas'
      },
      {
        name: "Spotlight",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'after',
        selector: '.product-form'
      },
      {
        name: "Spotlight",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__buttons'
      },
      {
        name: "Spotlight",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'after',
        selector: '.product-form__buttons'
      },
      {
        name: "Spotlight",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'before',
        selector: '#cart-notification-product'
      },
      {
        name: "Spotlight",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'after',
        selector: '.cart-notification-product'
      },
      {
        name: "Spotlight",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'after',
        selector: '.cart-notification-product'
      },





      {
        name: "Ride",
        type: "cart",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        action: 'before',
        selector: '#cart'
      },
      {
        name: "Ride",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '.cart__ctas'
      },
      {
        name: "Ride",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '.cart__ctas'
      },
      {
        name: "Ride",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'after',
        selector: '.product-form'
      },
      {
        name: "Ride",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__buttons'
      },
      {
        name: "Ride",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'after',
        selector: '.product-form__buttons'
      },
      {
        name: "Ride",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'before',
        selector: '#cart-notification-product'
      },
      {
        name: "Ride",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'after',
        selector: '.cart-notification-product'
      },
      {
        name: "Ride",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'after',
        selector: '.cart-notification-product'
      },





      {
        name: "Origin",
        type: "cart",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        action: 'before',
        selector: '#cart'
      },
      {
        name: "Origin",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '#cart__ctas'
      },
      {
        name: "Origin",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '#cart__ctas'
      },
      {
        name: "Origin",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'after',
        selector: '.product-form'
      },
      {
        name: "Origin",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__quantity'
      },
      {
        name: "Origin",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'after',
        selector: '.product-form__quantity'
      },
      {
        name: "Origin",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'before',
        selector: '.cart-item:first'
      },
      {
        name: "Origin",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'prepend',
        selector: '.drawer__footer'
      },
      {
        name: "Origin",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'prepend',
        selector: '.drawer__footer'
      },





      {
        name: "Sense",
        type: "cart",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        action: 'before',
        selector: '.cart-items'
      },
      {
        name: "Sense",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '.cart__ctas'
      },
      {
        name: "Sense",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '.cart__ctas'
      },
      {
        name: "Sense",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'before',
        selector: "[class*='product__description']"
      },
      {
        name: "Sense",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__quantity'
      },
      {
        name: "Sense",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'after',
        selector: '.product-form__quantity'
      },
      {
        name: "Sense",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'before',
        selector: '#cart-notification-product'
      },
      {
        name: "Sense",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'before',
        selector: '#cart-notification-button'
      },
      {
        name: "Sense",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'before',
        selector: '#cart-notification-button'
      },





      {
        name: "Craft",
        type: "cart",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        action: 'before',
        selector: '.cart-items'
      },
      {
        name: "Craft",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '.cart__ctas'
      },
      {
        name: "Craft",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '.cart__ctas'
      },
      {
        name: "Craft",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'before',
        selector: "[class*='product__description']"
      },
      {
        name: "Craft",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__quantity'
      },
      {
        name: "Craft",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'after',
        selector: '.product-form__quantity'
      },
      {
        name: "Craft",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'before',
        selector: '#cart-notification-product'
      },
      {
        name: "Craft",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'before',
        selector: '#cart-notification-button'
      },
      {
        name: "Craft",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'before',
        selector: '#cart-notification-button'
      },





      {
        name: "Refresh",
        type: "cart",
        position: 1,
        action: 'before',
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_1.png",
        selector: '.cart-items'
      },
      {
        name: "Refresh",
        type: "cart",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_2.png",
        action: 'before',
        selector: '.cart__ctas'
      },
      {
        name: "Refresh",
        type: "cart",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/cart_page_image_3.png",
        action: 'after',
        selector: '.cart__ctas'
      },
      {
        name: "Refresh",
        type: "product",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_1.png",
        action: 'before',
        selector: "[class*='product__description']"
      },
      {
        name: "Refresh",
        type: "product",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_2.png",
        action: 'before',
        selector: '.product-form__quantity'
      },
      {
        name: "Refresh",
        type: "product",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/product_page_image_3.png",
        action: 'after',
        selector: '.product-form__quantity'
      },
      {
        name: "Refresh",
        type: "ajax",
        position: 1,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_1.png",
        action: 'prepend',
        selector: '#CartDrawer-Form'
      },
      {
        name: "Refresh",
        type: "ajax",
        position: 2,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_2.png",
        action: 'before',
        selector: '#cart-notification-button'
      },
      {
        name: "Refresh",
        type: "ajax",
        position: 3,
        image_url: "https://incartupsell.nyc3.cdn.digitaloceanspaces.com/placement-images/ajax_cart_image_3.png",
        action: 'before',
        selector: '#cart-notification-button'
      },
    ]

    themeSettingForTemplate.each do |themeSetting|
      ThemeSettingForTemplate.find_or_create_by(theme_name: themeSetting[:name], page_type: themeSetting[:type], position: themeSetting[:position], action: themeSetting[:action], selector: themeSetting[:selector], image_url: themeSetting[:image_url])
    end
  end
end
