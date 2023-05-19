# == Schema Information
#
# Table name: themes
#
#  id                  :integer          not null, primary key
#  name                :string
#  settings_asset_file :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  active              :boolean          default(FALSE), not null
#  cart_type_path      :string
#  ajax_refresh_code   :text
#  css                 :text
#

# This is where we store presets for some of the more popular shopify themes
class Theme < ApplicationRecord
  include Hex
  has_many :cart_types
  accepts_nested_attributes_for :cart_types, allow_destroy: true, reject_if: :all_blank

end
