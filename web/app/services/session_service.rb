class SessionService

  def create_session(session_params)
    session = Session.new(session_params)
    if session.save
      puts 'Session Created'
      { message: 'Session created successfully', status: :ok }
      return true
    else
      { message: 'Session can not be created', status: :unprocessable_entity }
      return false
    end
  end

  def update_session(session_params, session)
    if session.update(session_params)
      puts 'Session Updated'
      { message: 'Session updated successfully', status: :ok }
      return true
    else
      { message: 'Session can not be created', status: :unprocessable_entity }
      return false
    end
  end
end
