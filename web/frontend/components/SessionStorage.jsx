  // File to call session storage endpoints and test them. Data is simulated.
  // Function to store session

  export const storeSession = async (fetch) => {
    try {
      // Dummy Session Data
      const SessionData = {
        session_id: Math.random().toString(36).slice(2),
        shop_domain: Math.random().toString(36).slice(2)+'.shopify.com',
        state: Math.random().toString(36).slice(2),
        is_online: Math.random() < 0.5,
        access_token: Math.random().toString(36).slice(2),
        scope: Math.random().toString(36).slice(2),
        expires: new Date().toLocaleString()
      };
      console.log("Storing/Updating Session:", SessionData);
      const response =  await fetch(`/api/merchant/sessions/store_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(SessionData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Session stored/Updated SUCCESSFULLY");
        return true;
      }
      else {
        console.log("Failed to store session:", data);
        return false;
      }
    } catch (error) {
      console.log('Error storing session:', error);
      return false;
    }
  };

  // Function to load session
  export const loadSession = async (sessionId, fetch) => {
    try {
      const response = await fetch(`/api/merchant/session/load_session${sessionId}`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  // Function to delete session
  export const deleteSession = async (sessionId) => {
    try {
      const response = await fetch(`/delete_session/${sessionId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log(data); // Handle response as needed
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  // Function to delete multiple sessions
  export const deleteSessions = async (sessionIds) => {
    try {
      const response = await fetch('/delete_sessions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: sessionIds }),
      });
      const data = await response.json();
      console.log(data); // Handle response as needed
    } catch (error) {
      console.error('Error deleting sessions:', error);
    }
  };

  // Function to find sessions by shop
  export const findSessionsByShop = async (shopName) => {
    try {
      const response = await fetch(`/sessions/${shopName}`);
      const data = await response.json();
      console.log(data); // Handle response as needed
    } catch (error) {
      console.error('Error finding sessions by shop:', error);
    }
  };
