# frozen_string_literal: true
require 'active_model'
class ShopPlan < RedisHashObject
  # TODO: Move to old repo
  include ActiveModel::Validations

  attr_accessor :key, :plan_set, :plan_key, :updated_at

  validates :key, presence: true

  validates :plan_set, presence: true

  validates :plan_key, presence: true

  validates :updated_at, presence: true

  def initialize(key:, plan_key:, plan_set: 'default')
    super(key: "Shop_Plan:#{key}")
    @plan_set = plan_set
    @plan_key = plan_key
    @updated_at = Time.now.to_s
    save
  end

  def self.delete_instance(key)
    $redis_plans_cache.del("Shop_Plan:#{key}")
  end

  def self.get_one_with_id(shop_id)
    get_one("Shop_Plan:#{shop_id}")
  end

  private

end
