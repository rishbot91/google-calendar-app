const express = require('express');
const { google } = require('googleapis');

const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// @route GET /api/calendar/events
router.get('/events', isLoggedIn, async (req, res) => {
  try {
    const { accessToken } = req.user;
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: 'primary',
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

module.exports = router;
