# frozen_string_literal: true

class UsageCharge < ApplicationRecord
  has_one :shop, through: :subscription
  belongs_to :subscription

  # Public class. Sum all paid charges from the last year.
  #
  # Return. Integer.
  def self.last_year_revenue
    all_charges = where(created_at: one_day_from_last_year_and_today, result: 'success')
    all_charges.to_a.sum(&:amount_cents)
  end

  # Private class. Select the fifth day of each month, when payments are already done.
  #
  # Return. Range.
  def self.one_day_from_last_year_and_today
    all_days = 1.year.ago.to_date..Time.now.utc.to_date
    all_days.first.beginning_of_day..all_days.last.end_of_day
  end

  private_class_method :one_day_from_last_year_and_today
end
