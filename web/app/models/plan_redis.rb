require 'active_model'

class PlanRedis
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
    @key = key
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

  def save
    return unless valid?

    flat_plan = flatten_hash_from(create_hash(['errors', 'validation_context']))
    $redis_plans_cache.hset(key, flatten_hash_from(flat_plan))
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

# Query

  # Fetches all plans that meet the key pattern provided, if none is provided it fetches all plans
  #
  # @param [Hash] field A hash object of key value pairs
  # @return [Array<PlanRedis>]
  def self.get_plans(fields = {})
    # get list of keys
    key_list = get_keys
    # iterate over keys to match fields required
    key_list.map { |key|
      # for each key the values must match
      stringed_fields = fields.stringify_keys
      found_hash = $redis_plans_cache.mapped_hmget(key, stringed_fields.keys)
      get_plan(key) if found_hash == stringed_fields
    }.compact
  end

  # Fetches all plans
  def self.all_plans
    # get list of keys
    key_list = get_keys
    key_list.map { |key|
      get_plan(key)
    }.compact
  end

  # Fetches first plan found based on provided key
  def self.get_plan(key)
    plan_hash = $redis_plans_cache.hgetall(key)
    some_hash = recreate_hash_from(plan_hash)

    # PlanRedis.new(key: key, price: plan_hash['price'], plan_set: plan_hash)
    PlanRedis.new(key: some_hash['key'], price: some_hash['price'], plan_set: some_hash['plan_set'],
                  features: some_hash['features'],
                  is_visible: some_hash['is_visible'], is_active: some_hash['is_active'])
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
  def self.get_keys(pattern = '*')
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
