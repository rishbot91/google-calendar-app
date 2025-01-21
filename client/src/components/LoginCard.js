import React from 'react';
import { Container, Paper, Typography, Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginCard = ({ handleLogin }) => {
  return (
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
  );
};

export default LoginCard;