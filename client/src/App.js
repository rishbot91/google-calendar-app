import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GoogleIcon from '@mui/icons-material/Google';
import FilterListIcon from '@mui/icons-material/FilterList';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';

const App = () => {
  // States
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  // Filter states for actual filtering
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);

  // Local states for user date input
  const [tempStart, setTempStart] = useState(null);
  const [tempEnd, setTempEnd] = useState(null);

  // Toggles the display of date pickers
  const [showFilters, setShowFilters] = useState(false);

  // On mount: verify user & fetch events if authenticated
  useEffect(() => {
    const verifyUserAndFetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/calendar/events', {
          withCredentials: true,
        });
        setEvents(response.data);
        setUser(true);
      } catch (error) {
        console.error('Error fetching events:', error);
        setUser(false);
      } finally {
        setLoading(false);
        setAuthChecking(false);
      }
    };

    verifyUserAndFetchEvents();
  }, []);

  // Login & Logout
  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:4000/auth/logout', { withCredentials: true });
      setUser(false);
      setEvents([]);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Apply the selected date filters, then hide date pickers
  const applyFilter = () => {
    setStartDateFilter(tempStart);
    setEndDateFilter(tempEnd);
    setShowFilters(false); // Hide date pickers after apply
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

  // 1. Checking if user is logged in => show loading screen
  if (authChecking) {
    return (
      <Box
        sx={{
          backgroundColor: '#1e1f20',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
        }}
      >
        <CircularProgress sx={{ color: '#71fff8', mb: 2 }} />
        <Typography sx={{ color: '#e3e3e3' }}>Checking your account...</Typography>
      </Box>
    );
  }

  // 2. Not logged in => login page
  if (!user) {
    return (
      <Box
        sx={{
          backgroundColor: '#1e1f20',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          margin: 0,
        }}
      >
        {/* App Name at the Top */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Typography variant="h3" sx={{ color: '#e3e3e3' }}>
            EventMaster
          </Typography>
        </Box>

        {/* Login Card */}
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Paper
            elevation={1}
            sx={{
              padding: 6,
              borderRadius: 10,
              backgroundColor: '#000000',
              width: '1300px',
              height: 'auto',
              maxWidth: '90%',
              marginX: 'auto',
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 400, color: '#e3e3e3' }}>
              Login to your account
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{
                fontWeight: 400,
                color: '##9a9da0',
                marginBottom: 3,
              }}
            >
              View and manage your Google Calendar events seamlessly.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLogin}
              sx={{
                position: 'relative',
                backgroundColor: 'transparent',
                color: '#20B2AA',
                border: '1px solid #71fff8',
                borderRadius: '4px',
                paddingX: 3,
                fontWeight: 300,
                textTransform: 'none',
                fontSize: '1rem',
                alignItems: 'center',
                gap: 1,
                transition: 'border-color 0.3s ease, color 0.3s ease',
                '&:hover': {
                  borderColor: '#71fff8',
                  color: '#71fff8',
                },
              }}
            >
              <GoogleIcon sx={{ fontSize: '1.5rem', marginRight: '8px' }} />
              Sign in with Google
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // 3. Logged in => events page
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

        {/* Filter Toggle Button */}
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

      {/*
        Conditionally render DatePickers + "Apply Filter" button
        If showFilters == true
      */}
      {showFilters && (
        <Box sx={{ mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <DatePicker
                label="Start Date"
                value={tempStart}
                onChange={(newValue) => setTempStart(newValue)}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      backgroundColor: '#ffffff',
                      borderRadius: 2,
                    }}
                  />
                )}
              />
              <DatePicker
                label="End Date"
                value={tempEnd}
                onChange={(newValue) => setTempEnd(newValue)}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      backgroundColor: '#ffffff',
                      borderRadius: 2,
                    }}
                  />
                )}
              />
            </Box>
          </LocalizationProvider>

          {/* Apply Filter Button */}
          <Button
            variant="contained"
            onClick={applyFilter}
            sx={{
              backgroundColor: '#20B2AA',
              color: '#000000',
              '&:hover': {
                backgroundColor: '#71fff8',
                color: '#000000',
              },
            }}
          >
            Apply Filter
          </Button>
        </Box>
      )}

      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#71fff8', mb: 1 }} />
          <Typography sx={{ color: '#e3e3e3' }}>Loading events...</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e1f20' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#e3e3e3' }}>
                  <strong>Summary</strong>
                </TableCell>
                <TableCell sx={{ color: '#e3e3e3' }}>
                  <strong>Date</strong>
                </TableCell>
                <TableCell sx={{ color: '#e3e3e3' }}>
                  <strong>Time</strong>
                </TableCell>
                <TableCell sx={{ color: '#e3e3e3' }}>
                  <strong>Location</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => {
                  const startDate = new Date(event.start.dateTime || event.start.date);
                  const endDate = new Date(event.end.dateTime || event.end.date);

                  // Format date/time
                  const formattedDate = new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }).format(startDate);

                  const formattedStartTime = new Intl.DateTimeFormat('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  }).format(startDate);

                  const formattedEndTime = new Intl.DateTimeFormat('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  }).format(endDate);

                  return (
                    <TableRow key={event.id}>
                      <TableCell sx={{ color: '#f0f0f0' }}>{event.summary}</TableCell>
                      <TableCell sx={{ color: '#f0f0f0' }}>{formattedDate}</TableCell>
                      <TableCell sx={{ color: '#f0f0f0' }}>
                        {formattedStartTime} - {formattedEndTime}
                      </TableCell>
                      <TableCell sx={{ color: '#f0f0f0', alignItems: 'center' }}>
                        {event.location ? (
                          <>
                            <LocationOnIcon sx={{ mr: 2, color: '#4285F4' }} />
                            {event.location}
                          </>
                        ) : (
                          <LocationOnIcon sx={{ color: '#4285F4' }} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: '#f0f0f0' }}>
                    No events found for the selected date range.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default App;
