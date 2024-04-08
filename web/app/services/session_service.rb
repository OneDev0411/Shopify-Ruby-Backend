class SessionService

  def create_session(session_params)
    session = Session.new(session_params)
    if session.save
      puts 'Session Created'
      { message: 'Session created successfully', status: :ok }
    else
      { message: 'Session can not be created', status: :unprocessable_entity }
    end
  end

  def update_session(session_params, session)
    if session.update(session_params)
      puts 'Session Updated'
      { message: 'Session updated successfully', status: :ok }
    else
      { message: 'Session can not be created', status: :unprocessable_entity }
    end
  end
end
