const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

const Train = require('./models/trainschema');
const Route = require('./models/routeschema');
const TrainHistory = require('./models/trainhistoryschema'); 

mongoose.connect('mongodb://localhost:27017/trainDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());

// API to get all trains
app.get('/trains', async (req, res) => {
  try {
    const trains = await Train.find();
    res.json(trains);
  } catch (error) {
    console.error('Error fetching train data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API to get a train by ID
app.get('/trains/:id', async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (train) {
      res.json(train);
    } else {
      res.status(404).send('Train not found');
    }
  } catch (error) {
    console.error('Error fetching train data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API to add a new train
app.post('/trains', async (req, res) => {
  try {
    const newTrain = new Train(req.body);
    await newTrain.save();
    res.status(201).json(newTrain);
  } catch (error) {
    console.error('Error adding train:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API to update a train by ID
app.put('/trains/:id', async (req, res) => {
  try {
    const updatedTrain = await Train.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedTrain) {
      res.json(updatedTrain);
    } else {
      res.status(404).send('Train not found');
    }
  } catch (error) {
    console.error('Error updating train:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API to delete a train by ID
app.delete('/trains/:id', async (req, res) => {
  try {
    const result = await Train.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(204).send(); 
    } else {
      res.status(404).send('Train not found');
    }
  } catch (error) {
    console.error('Error deleting train:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API to get all routes
app.get('/routes', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    console.error('Error fetching route data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API to get a route by ID
app.get('/routes/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (route) {
      res.json(route);
    } else {
      res.status(404).send('Route not found');
    }
  } catch (error) {
    console.error('Error fetching route data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API to add a new route
app.post('/routes', async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (error) {
    console.error('Error adding route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API to update a route by ID
app.put('/routes/:id', async (req, res) => {
  try {
    const updatedRoute = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedRoute) {
      res.json(updatedRoute);
    } else {
      res.status(404).send('Route not found');
    }
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API to delete a route by ID
app.delete('/routes/:id', async (req, res) => {
  try {
    const result = await Route.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(204).send(); 
    } else {
      res.status(404).send('Route not found');
    }
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/trainHistory', async (req, res) => {
  try {
    const history = await TrainHistory.find();
    res.json(history);
  } catch (error) {
    console.error('Error fetching train history:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
