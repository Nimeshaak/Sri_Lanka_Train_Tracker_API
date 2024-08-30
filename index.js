const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors()); 

// Connect to MongoDB (adjust the connection string as needed)
mongoose.connect('mongodb://localhost:27017/trainData', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Could not connect to MongoDB:', error));

// Define a schema and model for train data
const trainSchema = new mongoose.Schema({
  trainId: Number,
  trainName: String,
  timestamp: Date,
  location: {
    latitude: Number,
    longitude: Number
  }
});

const Train = mongoose.model('Train', trainSchema);

// Endpoint to receive train data and save it to the database (CREATE)
app.post('/trains', (req, res) => {
  console.log('Received data:', req.body);

  const newTrain = new Train(req.body);
  newTrain.save()
    .then(() => res.status(200).send('Data received and saved to database'))
    .catch(error => res.status(500).send('Error saving data: ' + error));
});

// Get all trains (READ)
app.get('/trains', (req, res) => {
  Train.find()
    .then(trains => res.json(trains))
    .catch(error => res.status(500).send('Error fetching data: ' + error));
});

// Get a train by ID (READ)
app.get('/trains/:id', (req, res) => {
  const trainId = req.params.id;
  Train.findById(trainId)
    .then(train => {
      if (!train) {
        return res.status(404).send('Train not found');
      }
      res.json(train);
    })
    .catch(error => res.status(500).send('Error fetching train data: ' + error));
});

// Update a train by ID (UPDATE)
app.put('/trains/:id', (req, res) => {
  const trainId = req.params.id;
  Train.findByIdAndUpdate(trainId, req.body, { new: true })
    .then(updatedTrain => {
      if (!updatedTrain) {
        return res.status(404).send('Train not found');
      }
      res.json(updatedTrain);
    })
    .catch(error => res.status(500).send('Error updating train data: ' + error));
});

// Delete a train by ID (DELETE)
app.delete('/trains/:id', (req, res) => {
  const trainId = req.params.id;
  Train.findByIdAndDelete(trainId)
    .then(deletedTrain => {
      if (!deletedTrain) {
        return res.status(404).send('Train not found');
      }
      res.status(200).send('Train deleted successfully');
    })
    .catch(error => res.status(500).send('Error deleting train: ' + error));
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
