import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';

const FilterControls = ({
  tempStart,
  setTempStart,
  tempEnd,
  setTempEnd,
  applyFilter,
}) => {
  return (
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
                  border: '1px solid #fff'
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
  );
};

export default FilterControls;
