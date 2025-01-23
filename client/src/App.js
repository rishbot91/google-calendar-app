import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Pages
import LoadingScreen from './pages/LoadingScreen';
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';

function App() {
  // Basic auth states
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState(null);

  // Check if user is logged in & fetch initial data
  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Attempt to fetch some private endpoint
        await axios.get('https://google-calendar-app.onrender.com/api/calendar/events', {
          withCredentials: true,
        });
        setUser(true);
      } catch (error) {
        setUser(false);
      } finally {
        setAuthChecking(false);
      }
    };

    verifyUser();
  }, []);

  // Login Handler
  const handleLogin = () => {
    window.location.href = 'https://google-calendar-app.onrender.com/auth/google';
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await axios.get('https://google-calendar-app.onrender.com/auth/logout', { withCredentials: true });
      setUser(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 1. Show loading screen while checking auth
  if (authChecking) return <LoadingScreen />;

  // 2. If user is false => show login page
  if (!user) {
    return <LoginPage handleLogin={handleLogin} />;
  }

  // 3. Otherwise, user is logged in => show the events page
  return <EventsPage handleLogout={handleLogout} />;
}

export default App;
