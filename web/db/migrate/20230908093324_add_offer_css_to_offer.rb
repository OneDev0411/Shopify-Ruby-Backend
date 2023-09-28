class AddOfferCssToOffer < ActiveRecord::Migration[7.0]
  def change
    add_column :offers, :css_options, :jsonb
    add_column :offers, :save_as_default_setting, :boolean, default: :false
    add_column :offers, :custom_css, :text
  end
end
