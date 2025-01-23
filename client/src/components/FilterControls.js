import React, { useState } from 'react';
import { Box, TextField, Button, Chip } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';
import{
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const FilterControls = ({
  tempStart,
  setTempStart,
  tempEnd,
  setTempEnd,
  applyFilter,
}) => {
  const [quickOption, setQuickOption] = useState(''); // Tracks selected quick option

  // Handler to set quick filter
  const handleQuickOption = (option) => {
    setQuickOption(option);
    const today = new Date();
    if (option === 'today') {
      setTempStart(today);
      setTempEnd(today);
    } else if (option === 'thisWeek') {
      const startOfWeek = new Date(today);
      // Adjust as needed if your "week" starts Monday vs Sunday
      const day = today.getDay(); // 0 = Sunday, 1=Monday, etc.
      console.log(day);
      startOfWeek.setDate(today.getDate() - day); // if day=0 => same day
      startOfWeek.setHours(0,0,0,0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23,59,59,999);

      setTempStart(startOfWeek);
      setTempEnd(endOfWeek);
    } else if (option === 'custom') {
      setTempStart(null);
      setTempEnd(null);
    }
  };

  // Clears BOTH start date & end date if the user wants
  const clearDates = () => {
    setTempStart(null);
    setTempEnd(null);
    // setQuickOption(''); // reset any quick option
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Quick Options Row */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Chip
          label="Today"
          clickable
          color={quickOption === 'today' ? 'primary' : 'default'}
          onClick={() => handleQuickOption('today')}
        />
        <Chip
          label="This Week"
          clickable
          color={quickOption === 'thisWeek' ? 'primary' : 'default'}
          onClick={() => handleQuickOption('thisWeek')}
        />
        <Chip
          label="Custom Range"
          clickable
          color={quickOption === 'custom' ? 'primary' : 'default'}
          onClick={() => handleQuickOption('custom')}
        />
        {/* Tooltip Info Icon */}
        <Tooltip
          title="Select a single date or range to view events."
          arrow
          enterTouchDelay={0}
        >
          <IconButton sx={{ color: '#71fff8' }}>
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* If "Custom Range" is chosen, show the date pickers */}
      {quickOption === 'custom' && (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
          {/* If the user has chosen a quick option or custom dates, 
          allow them to clear if they wish */}
      {(tempStart || tempEnd) && (
        <Button variant="outlined" onClick={clearDates}>
          Clear
        </Button>
      )}
        </LocalizationProvider>
      )}

      

      {/* Apply Filter Button */}
      <Button
        variant="contained"
        onClick={applyFilter}
        sx={{
          borderRadius: '8px',
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
  );
};

export default FilterControls;