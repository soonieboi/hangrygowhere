const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');


const app = express();
const port = process.env.PORT || 3000;
const apiKey = 'AIzaSyDOTut4xJhVq96mT9yoWL1jQ-Oy2gkfNDo';
// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://sherminh0512:Soonieboi%402019@hangrydb.lxf679w.mongodb.net/hangrydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false, // Set to true by default, can be set to false
  bufferMaxEntries: 0,   // Set to 0 for unlimited buffering
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a Mongoose schema and model
const feedbackSchema = new mongoose.Schema({
  name: String,
  contact: String,
  feedback: String,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle form submission
app.post('/submit-feedback', (req, res) => {
  const { name, contact, feedback } = req.body;

  // Create a new Feedback document
  const newFeedback = new Feedback({
    name,
    contact,
    feedback,
  });

  // Save the document to MongoDB
  newFeedback.save()
    .then(() => {
      // Render a success page with a "Back to Home" link
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Feedback Submitted</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap">
          <style>
            body {
              font-family: 'Montserrat', sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 0;
              text-align: center;
            }

            h1 {
              text-align: center;
              color: #007bff;
            }

            p {
              max-width: 600px;
              margin: 0 auto;
              font-size: 18px;
              line-height: 1.6;
            }

            a {
              display: block;
              margin-top: 20px;
              text-align: center;
              color: #007bff;
              text-decoration: none;
              font-weight: bold;
              font-size: 16px;
            }

            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h1>Feedback Submitted Successfully!</h1>
          <a href="/">Back to Home 🏠</a>
        </body>
        </html>
      `);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});


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

// // map
// function initMap() {
//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: { lat: 1.3521, lng: 103.8198 },
//     zoom: 11.5,
//   });

//   // Add a marker at the center of the map
//   var centerMarker = new google.maps.Marker({
//     position: { lat: 1.3521, lng: 103.8198 },
//     map: map,
//     title: 'Center Marker',
//   });
// }



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
