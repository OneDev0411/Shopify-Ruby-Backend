# frozen_string_literal: true


# This model is for tracking scheduled jobs that are in progress
class PendingJob < ApplicationRecord
  belongs_to :shop

  def readable_description
    a = if description == "publish"
      "Republishing JS Tag"
    elsif description == "inventorysync"
      "Updating Offered Product Details"
    elsif description == "refreshsalesintel"
      "Refreshing Sales Intelligence"
    else
      description.capitalize
    end
    "#{a} (in progress)"
  end

  def to_json
    {
      description: description,
      readable_description: readable_description,
      job_id: job_id || sidekiq_id
    }
  end
end
