import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Open Sans", Arial, sans-serif', // Set Open Sans globally
  },
  palette: {
    mode: 'dark', // Enables dark mode
    background: {
      default: '#1e1f20', // Background color similar to Google sign-in page
      paper: '#1e1e1e', // Card or container color
    },
    primary: {
      main: '#4285F4', // Google's primary blue
    },
    secondary: {
      main: '#EA4335', // Google's secondary red
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0', // Subtle text color
    },
  },
  overrides: {
    
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
