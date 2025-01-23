const express = require('express');
const passport = require('passport');

const router = express.Router();

// @route   GET /auth/google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar'],
  })
);

// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'https://youreve.netlify.app/login?error=true',
  }),
  (req, res) => {
    // Successful authentication
    res.redirect('https://youreve.netlify.app/');
  }
);

// @route   GET /auth/logout
router.get('/logout', (req, res) => {
  if (req.logout) {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Failed to log out' });
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return res.status(500).json({ error: 'Failed to destroy session' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.send('Logged out successfully');
      });
    });
  } else {
    res.status(400).json({ error: 'Logout not supported' });
  }
});

module.exports = router;
