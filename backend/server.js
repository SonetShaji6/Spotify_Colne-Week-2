const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fetch = require('node-fetch'); // For making API calls
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 5001;
const DB_URI = 'mongodb://localhost:27017/project1'; // MongoDB Compass

// Spotify credentials
const CLIENT_ID = 'fc204828ff4f4ffb88feb16851c2d021';
const CLIENT_SECRET = '75e52d40ecb9474088ed6667299b1cc3';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(DB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Spotify token route
app.post('/api/token', async (req, res) => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    res.status(500).json({ error: 'Failed to fetch Spotify token' });
  }
});

// Auth routes
app.use('/', authRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
