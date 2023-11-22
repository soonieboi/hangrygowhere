const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;
const apiKey = 'AIzaSyDOTut4xJhVq96mT9yoWL1jQ-Oy2gkfNDo';

app.use(express.static('public'));

app.get('/places', async (req, res) => {
  try {
    const { query } = req.query;
    const apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const response = await axios.get(apiUrl, {
      params: {
        query,
        key: apiKey,
      },
    });
    const places = response.data.results;
    res.json(places);
  } catch (error) {
    console.error('Error fetching Google Places API:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Function to generate a random query
function generateRandomQuery() {
    const foodTerms = ['sushi', 'pizza', 'burgers', 'ramen', 'tacos'];
    const randomIndex = Math.floor(Math.random() * foodTerms.length);
    return foodTerms[randomIndex];
  }

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
