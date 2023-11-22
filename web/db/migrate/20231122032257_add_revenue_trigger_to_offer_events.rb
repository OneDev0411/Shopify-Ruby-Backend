class AddRevenueTriggerToOfferEvents < ActiveRecord::Migration[7.0]
  def up
    # Create the function
    execute <<-SQL
      CREATE FUNCTION offer_revenue_incrementer() RETURNS trigger AS $offer_revenue_incrementer$
        BEGIN
      
              IF NEW.offer_id IS NOT NULL AND NEW.action = 'sale' THEN
                  IF TG_OP = 'INSERT' then
                      UPDATE offers SET total_revenue = total_revenue + COALESCE(NEW.amount, 0) WHERE id = NEW.offer_id;
                  END IF;
      
                  IF TG_OP = 'UPDATE' then
                      UPDATE offers SET total_revenue = total_revenue - COALESCE(OLD.amount, 0) + COALESCE(NEW.amount, 0) WHERE id = NEW.offer_id;
                  END IF;
              END IF;
      
              RETURN NEW;
      
        END;
      $offer_revenue_incrementer$ LANGUAGE plpgsql;
    SQL

    # Create the trigger
    execute <<-SQL
      CREATE TRIGGER offer_revenue_trigger 
      AFTER INSERT OR UPDATE  ON offer_events 
      FOR EACH ROW EXECUTE PROCEDURE offer_revenue_incrementer();
    SQL
  end

  def down
    # Drop the trigger
    execute <<-SQL
      DROP TRIGGER IF EXISTS offer_revenue_trigger ON offer_events;
    SQL

    # Drop the function
    execute <<-SQL
      DROP FUNCTION IF EXISTS offer_revenue_incrementer;
    SQL
  end
end