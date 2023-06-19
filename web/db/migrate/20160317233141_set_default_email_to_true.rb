class SetDefaultEmailToTrue < ActiveRecord::Migration[5.2]
  def change
    change_column_default :shops, :send_status_emails, true
  end
end
