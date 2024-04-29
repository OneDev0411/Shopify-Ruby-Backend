# frozen_string_literal: true
require 'active_model'
class ShopPlan
  # TODO: Move to old repo
  include ActiveModel::Validations

  attr_accessor :key, :plan_set, :plan_key, :updated_at

  validates :key, presence: true

  validates :plan_set, presence: true

  validates :plan_key, presence: true

  validates :updated_at, presence: true

  def initialize(key:, plan_key:, plan_set: 'default')
    @key = "Shop_Plan:#{key}"
    @plan_set = plan_set
    @plan_key = plan_key
    @updated_at = Time.now.to_s
    save
  end

  def save
    return unless valid?

    flat_hash = flatten_hash_from(create_hash(%w[errors validation_context]))
    $redis_plans_cache.hset(key, flatten_hash_from(flat_hash))
  end

  def update(update_hash)
    update_hash.each do |key, value|
      instance_variables.each do |iv|
        if iv.to_s.delete_prefix('@') == key.to_s
          instance_variable_set(iv, value.to_s)
        end
      end
    end

    @updated_at = Time.now.to_s
    save
  end

  def self.delete_instance(key)
    $redis_plans_cache.del("Shop_Plan:#{key}")
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
      get_one(key) if found_hash == stringed_fields
    }.compact
  end

  # Fetches all plans
  def self.all
    # get list of keys
    key_list = all_keys
    key_list.map { |key|
      get_one(key)
    }.compact
  end

  # Fetches first plan found based on provided key
  def self.get_one(key)
    hash_data = $redis_plans_cache.hgetall(key)
    recreate_hash_from(hash_data)
  end

  def self.shop_from_hash_data(hash_data)
    ShopPlan.new(key: hash_data['key'], plan_set: hash_data['plan_set'],
                 plan_key: hash_data['plan_key'])
  end

  # Unflattens the hash obtained from redis
  def self.recreate_hash_from(hash)

    hash.each_with_object({}) do |(key, value), memo|
      if key.include?('[')
        arr_name = key.split('[').first
        memo[arr_name] = [] if memo[arr_name].nil?
        memo[arr_name].push value
        next
      end
      memo[key] = value
    end
  end

  # Gets all keys for the associated plans
  def self.all_keys(pattern = '*')
    # get list of keys
    scan_data = $redis_plans_cache.scan(0, match: pattern)
    return [] if scan_data[0].empty?

    # iterate over keys to match fields required
    keys = []
    loop do
      scan_data[1].each { |key|
        keys << key
      }.compact
      break if scan_data[0].to_i.zero?

      scan_data = $redis_plans_cache.scan(scan_data[0], match: pattern)
    end
    keys
  end

  private

  def create_hash(exclude_keys = [])
    instance_variables.each_with_object({}) do |var, hash|
      next if exclude_keys.include?(var.to_s[/(?<=@)(\w+)/])

      if instance_variable_get(var).is_a? Array
        hash[var.to_s.delete('@')] = instance_variable_get(var)
      else
        hash[var.to_s.delete('@')] = instance_variable_get(var).to_s
      end
    end
  end

  # Flattens the plan hash such that it can be saved to the redis cache
  def flatten_hash_from(hash)
    hash.each_with_object({}) do |(key, value), memo|
      if value.is_a? Hash
        next flatten_hash_from(value).each do |k, v|
          memo["#{key}.#{k}".intern] = v
        end
      elsif value.is_a? Array
        # Does not account for hashes in arrays
        next value.each_with_index do |v, i|
          memo["#{key}[#{i}]"] = v
        end
      end
      memo[key] = value
    end
  end
end
