require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./passport-setup'); // We will create this next

const app = express();

// CORS Setup
app.use(cors({
  origin: 'https://youreve.netlify.app/',
  methods: 'GET,POST',
  credentials: true,
}));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Test route
app.get('/', (req, res) => {
  res.send('Hello from the Google Calendar App server!');
});

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Calendar routes
const calendarRoutes = require('./routes/calendarRoutes');
app.use('/api/calendar', calendarRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
