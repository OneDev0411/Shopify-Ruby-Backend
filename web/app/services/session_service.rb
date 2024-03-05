class SessionService

  def create_session(session_params)
    session = Session.new(session_params)
    begin
      if session.save
        puts 'Session Created'
        { message: 'Session created successfully', status: :ok }
      else
        { message: 'Session can not be created', status: :unprocessable_entity }
      end
    rescue => err
      ErrorNotifier.call(err)
      { message: 'An error occurred while creating the session', status: :internal_server_error }
    end
  end

  def update_session(session_params, session)
    begin  
      if session.update(session_params)
        puts 'Session Updated'
        { message: 'Session updated successfully', status: :ok }
      else
        { message: 'Session can not be created', status: :unprocessable_entity }
      end
    rescue => err
      ErrorNotifier.call(err)
      { message: 'An error occurred while updating the session', status: :internal_server_error }
    end
  end
end
