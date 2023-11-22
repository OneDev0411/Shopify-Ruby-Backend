class AddClicksAndViewsTriggerToDailyStats < ActiveRecord::Migration[7.0]
  def up
    # Create the function
    execute <<-SQL
      CREATE FUNCTION offer_clicks_and_views_incrementer() RETURNS trigger AS $offer_clicks_and_views_incrementer$
        BEGIN
      
              IF NEW.offer_id IS NOT NULL THEN
                  IF TG_OP = 'INSERT' then
                      UPDATE offers SET total_views = total_views + NEW.times_loaded, total_clicks = total_clicks + NEW.times_clicked WHERE id = NEW.offer_id;
                  END IF;
      
                  IF TG_OP = 'UPDATE' then
                      UPDATE offers SET total_views = total_views - OLD.times_loaded + NEW.times_loaded, total_clicks = total_clicks - OLD.times_clicked  + NEW.times_clicked WHERE id = NEW.offer_id;
                  END IF;
              END IF;
      
              RETURN NEW;
        END;
      $offer_clicks_and_views_incrementer$ LANGUAGE plpgsql;
    SQL

    # Create the trigger
    execute <<-SQL
      CREATE TRIGGER offer_clicks_and_views_trigger 
      AFTER INSERT OR UPDATE ON daily_stats 
      FOR EACH ROW EXECUTE PROCEDURE offer_clicks_and_views_incrementer();
    SQL
  end

  def down
    # Drop the trigger
    execute <<-SQL
      DROP TRIGGER IF EXISTS offer_clicks_and_views_trigger ON daily_stats;
    SQL

    # Drop the function
    execute <<-SQL
      DROP FUNCTION IF EXISTS offer_clicks_and_views_incrementer;
    SQL
  end
end