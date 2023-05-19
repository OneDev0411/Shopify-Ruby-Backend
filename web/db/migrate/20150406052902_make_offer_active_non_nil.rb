class MakeOfferActiveNonNil < ActiveRecord::Migration[5.2]
  def change
    change_column :offers, :active, :boolean, nil: false, default: false
  end
end
