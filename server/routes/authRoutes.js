const express = require('express');
const passport = require('passport');

const router = express.Router();

// @route   GET /auth/google
router.get(
  '/google',
  passport.authenticate('google', {
    // scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly'],
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events'],
    // scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
  })
);

// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login?error=true',
  }),
  (req, res) => {
    // Successful authentication
    res.redirect('http://localhost:3000/');
  }
);

// @route   GET /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.send('Logged out');
});

module.exports = router;
