// src/pages/EventsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

import FilterControls from '../components/FilterControls';
import EventTable from '../components/EventTable';

/**
 * The main page showing:
 *  - A logout button
 *  - A "Filter" toggle button
 *  - The date pickers + "Apply Filter"
 *  - The table of events
 */
const EventsPage = ({ handleLogout }) => {
  // loading events
  const [loading, setLoading] = useState(false);
  // all events from the server
  const [events, setEvents] = useState([]);

  // States used for actual filtering
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);

  // Local states while picking date
  const [tempStart, setTempStart] = useState(null);
  const [tempEnd, setTempEnd] = useState(null);

  // Toggles the display of the filter controls
  const [showFilters, setShowFilters] = useState(false);

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/calendar/events', {
          withCredentials: true,
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply Filter => copy temp states to real filter states, then hide filters
  const applyFilter = () => {
    setStartDateFilter(tempStart);
    setEndDateFilter(tempEnd);
    setShowFilters(false);
  };

  // Filter & sort events
  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start.dateTime || event.start.date);
      if (startDateFilter && eventDate < new Date(startDateFilter)) return false;
      if (endDateFilter && eventDate > new Date(endDateFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.start.dateTime || a.start.date);
      const dateB = new Date(b.start.dateTime || b.start.date);
      // Descending order: most recent first
      return dateB - dateA;
    });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#e3e3e3' }}>
        Google Calendar Events
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        {/* Logout Button */}
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>

        {/* Filter Toggle */}
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters((prev) => !prev)}
          sx={{
            color: '#20B2AA',
            borderColor: '#20B2AA',
            '&:hover': {
              borderColor: '#71fff8',
              color: '#71fff8',
            },
          }}
        >
          Filter
        </Button>
      </Box>

      {showFilters && (
        <FilterControls
          tempStart={tempStart}
          setTempStart={setTempStart}
          tempEnd={tempEnd}
          setTempEnd={setTempEnd}
          applyFilter={applyFilter}
        />
      )}

      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#71fff8', mb: 1 }} />
          <Typography sx={{ color: '#e3e3e3' }}>Loading events...</Typography>
        </Box>
      ) : (
        <EventTable filteredEvents={filteredEvents} />
      )}
    </Container>
  );
};

export default EventsPage;
