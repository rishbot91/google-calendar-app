import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const EventTable = ({ filteredEvents }) => {
  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#000', borderRadius: '16px'}}>
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
                  <TableCell sx={{ color: '#f0f0f0' }}>
                    {event.summary}
                  </TableCell>
                  <TableCell sx={{ color: '#f0f0f0' }}>
                    {formattedDate}
                  </TableCell>
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
  );
};

export default EventTable;
