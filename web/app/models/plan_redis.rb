require 'active_model'

class PlanRedis
  include ActiveModel::Validations

  attr_accessor :key, :name, :price, :plan_set, :is_visible, :is_active, :created_at, :updated_at, :features

  validates :key, presence: true

  validates :name, presence: true

  validates :price, presence: true

  validates :plan_set, presence: true

  validates :is_visible, inclusion: { in: [true, false] }

  validates :is_active, inclusion: { in: [true, false] }

  validates :created_at, presence: true

  validates :updated_at, presence: true

  validates :features, presence: true

  def initialize(key:, price:, plan_set:, features: [], **options)
    @key = key
    # Pulls the string after the colon to save the name
    @name = key[/(?<=:)(\w+)/]
    @price = price
    @plan_set = plan_set
    @features = features
    @created_at = Time.now.to_s
    @updated_at = Time.now.to_s
    @is_visible = options[:is_visible].nil? ? true : options[:is_visible]
    @is_active = options[:is_active].nil? ? true : options[:is_active]
  end

# Read
# Update

  def save
    return unless valid?

    flat_plan = flatten_hash_from(create_hash(['errors', 'validation_context']))
    $redis_plans_cache.hset(key, flatten_hash_from(flat_plan))
  end

  private

  def create_hash(exclude_keys = [])
    self.instance_variables.each_with_object({}) do |var, hash|
      next if exclude_keys.include?(var.to_s[/(?<=@)(\w+)/])

      if self.instance_variable_get(var).is_a? Array
        hash[var.to_s.delete('@')] = self.instance_variable_get(var)
      else
        hash[var.to_s.delete('@')] = self.instance_variable_get(var).to_s
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
