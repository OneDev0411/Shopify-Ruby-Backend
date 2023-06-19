class CreateOnboardingMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :onboarding_messages do |t|
      t.string :subject
      t.datetime :sent_at
      t.datetime :opened_at
      t.datetime :clicked_at
      t.references :shop, index: true

      t.timestamps null: false
    end
    add_foreign_key :onboarding_messages, :shops
  end
end
