import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
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
};

export default LoadingScreen;
