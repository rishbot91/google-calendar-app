import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const EventTable = ({ filteredEvents }) => {
  // Pagination states
  const [rowsPerPage, setRowsPerPage] = useState(7); // Display 7 rows per page
  const [page, setPage] = useState(0); // Current page

  // Handle Page Change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle Rows Per Page Change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Calculate Paginated Events
  const paginatedEvents = filteredEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: '#000', borderRadius: '16px' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#e3e3e3', fontSize: '20px' }}>
                <strong>Event name</strong>
              </TableCell>
              <TableCell sx={{ color: '#e3e3e3', fontSize: '20px' }}>
                <strong>Date</strong>
              </TableCell>
              <TableCell sx={{ color: '#e3e3e3', fontSize: '20px' }}>
                <strong>Time</strong>
              </TableCell>
              <TableCell sx={{ color: '#e3e3e3', fontSize: '20px'}}>
                <strong>Location</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              // Default row style: fix row height, hide overflow
              // Expand on hover to show full text
              '& tr': {
                height: 50,
                overflow: 'hidden',
                transition: 'height 0.3s ease',
              },
              // Each cell text truncated by default
              '& td': {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: '200px', // Limit width for truncation
              },
              // On hover, let the row expand, and cells show multiline text
              '& tr:hover': {
                height: 'auto',
              },
              '& tr:hover td': {
                whiteSpace: 'normal',
                overflow: 'visible',
              },
            }}
          >
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event) => {
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

                // Check if location is a link
                const locationText = event.location || '';
                const isLink =
                  locationText.startsWith('http://') || locationText.startsWith('https://');

                // If it's a link, display "Online webinar" as a clickable link
                let locationDisplay = locationText;
                let locationHref = null;

                if (isLink) {
                  locationDisplay = 'Online webinar';
                  locationHref = locationText;
                }

                return (
                  <TableRow key={event.id}>
                    {/* Summary (Event Name) */}
                    <TableCell sx={{ color: '#f0f0f0', maxWidth: '300px' }}>
                      {event.summary}
                    </TableCell>

                    {/* Date */}
                    <TableCell sx={{ color: '#f0f0f0', maxWidth: '150px' }}>
                      {formattedDate}
                    </TableCell>

                    {/* Time */}
                    <TableCell sx={{ color: '#f0f0f0', maxWidth: '150px' }}>
                      {formattedStartTime} - {formattedEndTime}
                    </TableCell>

                    {/* Location */}
                    <TableCell sx={{ color: '#f0f0f0', maxWidth: '250px' }}>
                      <LocationOnIcon
                        sx={{
                          color: '#4285F4',
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          mr: '4px',
                        }}
                      />
                      {isLink ? (
                        <a
                          href={locationHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#f0f0f0',
                            textDecoration: 'none',
                          }}
                        >
                          {locationDisplay}
                        </a>
                      ) : (
                        <span>{locationDisplay}</span>
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

      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={filteredEvents.length} // Total rows
        rowsPerPage={rowsPerPage} // Rows per page
        page={page} // Current page
        onPageChange={handleChangePage} // Handle page change
        onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page
        sx={{
          color: '#e3e3e3',
          '& .MuiTablePagination-actions': { color: '#71fff8' },
        }}
      />
    </>
  );
};

export default EventTable;