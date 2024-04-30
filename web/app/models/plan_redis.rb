# frozen_string_literal: true
require 'active_model'
class PlanRedis < RedisHashObject
  include ActiveModel::Validations

  attr_accessor :key, :name, :price, :plan_set, :is_visible, :is_active, :created_at, :updated_at, :features

  validates :key, presence: true

  validates :name, presence: true

  validates :price, presence: true

  validates :plan_set, presence: true

  validates :is_visible, inclusion: { in: [true, false, 'true', 'false'] }

  validates :is_active, inclusion: { in: [true, false, 'true', 'false'] }

  validates :created_at, presence: true

  validates :updated_at, presence: true

  validates :features, presence: true, allow_blank: true

  def initialize(key:, price:, plan_set: 'default', features: [], **options)
    super(key: key)
    # Pulls the string after the colon to save the name
    @name = key[/(?<=:)(\w+)/]
    @price = price
    @plan_set = plan_set
    @features = features
    @created_at = Time.now.to_s
    @updated_at = Time.now.to_s
    @is_visible = options[:is_visible].nil? ? false : options[:is_visible]
    @is_active = options[:is_active].nil? ? true : options[:is_active]
    save
  end

  # Clones the plan with the provided key and saves the copy
  def duplicate(name = 'Clone')
    new_plan = clone
    new_plan.update_name(name)
    new_plan.save
  end

  def update_name(name)
    @key = @key.sub(/:\w+/, name)
    @name = name
  end


# Query

  # Fetches all plans that meet the key pattern provided, if none is provided it fetches all plans
  #
  # @param [Hash] field A hash object of key value pairs
  # @return [Array<PlanRedis>]
  def self.get_with_fields(fields = {})
    # get list of keys
    key_list = all_keys
    # iterate over keys to match fields required
    key_list.map { |key|
      # for each key the values must match
      stringed_fields = fields.stringify_keys
      found_hash = $redis_plans_cache.mapped_hmget(key, stringed_fields.keys)
      get_plan(key) if found_hash == stringed_fields
    }.compact
  end

  # Fetches first plan found based on provided key
  def self.get_plan(key)
    some_hash = get_one(key)

    # PlanRedis.new(key: key, price: plan_hash['price'], plan_set: plan_hash)
    PlanRedis.new(key: some_hash['key'], price: some_hash['price'], plan_set: some_hash['plan_set'],
                  features: some_hash['features'],
                  is_visible: some_hash['is_visible'], is_active: some_hash['is_active'])
  end
end
