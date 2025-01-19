import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Optional, for styling
import { format, parseISO } from 'date-fns';

function App() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Check if user is logged in on mount
  useEffect(() => {
    // Attempt to fetch events. If 401, user is not logged in.
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/calendar/events', {
        withCredentials: true,
      });
      setEvents(response.data);
      setUser(true); // If events loaded, assume user is logged in
    } catch (error) {
      console.log('Error fetching events:', error);
      setUser(false);
    }
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };

  const handleLogout = async () => {
    await axios.get('http://localhost:4000/auth/logout', { withCredentials: true });
    setUser(false);
    setEvents([]);
  };

  // Filter events by date
  const filteredEvents = events.filter((event) => {
    const eventDate = event.start.date || event.start.dateTime; // Could be all-day (date) or specific time (dateTime)
    const eventDateObj = parseISO(eventDate);

    if (startDateFilter && eventDateObj < parseISO(startDateFilter)) {
      return false;
    }
    if (endDateFilter && eventDateObj > parseISO(endDateFilter)) {
      return false;
    }
    return true;
  });

  // Sort events by start date (descending: most recent on top)
  filteredEvents.sort((a, b) => {
    const dateA = parseISO(a.start.date || a.start.dateTime);
    const dateB = parseISO(b.start.date || b.start.dateTime);
    return dateB - dateA; // for descending
  });

  return (
    <div className="App">
      <header>
        <h1>Google Calendar Events</h1>
      </header>

      {!user ? (
        <div>
          <p>Please log in with Google to view your events.</p>
          <button onClick={handleLogin}>Login with Google</button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={handleLogout}>Logout</button>
          </div>
          
          {/* Date Filters */}
          <div style={{ marginBottom: '1rem' }}>
            <label>
              Start Date:
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
              />
            </label>
            <label style={{ marginLeft: '1rem' }}>
              End Date:
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
              />
            </label>
          </div>

          {/* Events Table */}
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Summary</th>
                <th>Start</th>
                <th>End</th>
                <th>Organizer</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="4">No events found for the selected date range.</td>
                </tr>
              ) : (
                filteredEvents.map((event) => {
                  const start = event.start.dateTime || event.start.date;
                  const end = event.end.dateTime || event.end.date;
                  const startFormatted = start ? format(parseISO(start), 'yyyy-MM-dd HH:mm') : '';
                  const endFormatted = end ? format(parseISO(end), 'yyyy-MM-dd HH:mm') : '';

                  return (
                    <tr key={event.id}>
                      <td>{event.summary}</td>
                      <td>{startFormatted}</td>
                      <td>{endFormatted}</td>
                      <td>{event.organizer && event.organizer.email}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
