const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

// Import Train and Route models
const Train = require('./models/trainschema');
const Route = require('./models/routeschema');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/trainDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(cors());
app.use(express.json());

// API to get all train data
app.get('/trains', async (req, res) => {
  try {
    const trains = await Train.find(); // Get all train data
    res.json(trains);
  } catch (error) {
    console.error('Error fetching train data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API to get all routes
app.get('/routes', async (req, res) => {
  try {
    const routes = await Route.find(); // Get all route data
    res.json(routes);
  } catch (error) {
    console.error('Error fetching route data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
