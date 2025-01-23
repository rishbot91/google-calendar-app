import React from 'react';
import { Box, Typography } from '@mui/material';

import LoginCard from '../components/LoginCard';

const LoginPage = ({ handleLogin }) => {
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

      {/* Show the actual login card */}
      <LoginCard handleLogin={handleLogin} />
    </Box>
  );
};

export default LoginPage;
