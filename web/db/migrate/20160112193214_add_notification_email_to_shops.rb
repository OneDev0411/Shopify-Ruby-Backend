class AddNotificationEmailToShops < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :notification_email, :string
    add_column :shops, :send_status_emails, :boolean
  end
end
