import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Paper,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

import FilterControls from '../components/FilterControls';
import EventTable from '../components/EventTable';

function EventsPage({ handleLogout }) {
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

  // Toggles the display of the filter box
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

  // Apply Filter => copy temp states to real filter states, then hide the box
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
      // Descending => most recent first
      return dateB - dateA;
    });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#e3e3e3' }}>
        Google Calendar Events
      </Typography>

      {/* Top bar with Filter + Logout */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Filter Button */}
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters((prev) => !prev)}
            sx={{
              borderRadius: '8px',
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

        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{
            borderRadius: '8px',
            borderColor: 'rgb(221, 0, 0)',
            '&:hover': {
              backgroundColor: 'rgb(221, 0, 0)',
              color: '#fff',
            },
          }}
        >
          Logout
        </Button>
      </Box>

      {/* 
        Conditionally render a box (Paper) that shows the filters. 
        This is a normal block element in the layout -> table is pushed down.
      */}
      {showFilters && (
        <Paper
          elevation={1}
          sx={{
            display: 'inline-block',
            mb: 3,             // margin-bottom to space it from the table
            p: 2,              // padding
            backgroundColor: '#000', // black background
            color: '#fff',
            borderRadius: '16px',
          }}
        >
          <FilterControls
            tempStart={tempStart}
            setTempStart={setTempStart}
            tempEnd={tempEnd}
            setTempEnd={setTempEnd}
            applyFilter={applyFilter}
          />
        </Paper>
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
}

export default EventsPage;