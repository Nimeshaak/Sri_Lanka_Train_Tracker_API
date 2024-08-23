const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Train = require('./models/train');

const app = express();
const PORT = 3000;

app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost/train_tracking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Middleware to parse JSON data
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Train Tracking API!');
});

// Create a new train (POST)
app.post('/trains', async (req, res) => {
    const { name, trainID, latitude, longitude, arrivalTime, departureTime } = req.body;

    try {
        const newTrain = new Train({
            name,
            trainID,
            latitude,
            longitude,
            arrivalTime,
            departureTime
        });
        await newTrain.save();
        res.status(201).json(newTrain);
    } catch (error) {
        res.status(400).json({ error: 'Unable to create train' });
    }
});

// Get all trains (GET)
app.get('/trains', async (req, res) => {
    try {
        const trains = await Train.find();
        res.status(200).json(trains);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch trains' });
    }
});

// Get a train by ID (GET)
app.get('/trains/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const train = await Train.findById(id);
        if (!train) {
            return res.status(404).json({ error: 'Train not found' });
        }
        res.status(200).json(train);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch train' });
    }
});

// Update a train by ID (PUT)
app.put('/trains/:id', async (req, res) => {
    const { id } = req.params;
    const { name, trainID, latitude, longitude, arrivalTime, departureTime } = req.body;

    try {
        const updatedTrain = await Train.findByIdAndUpdate(
            id,
            { name, trainID, latitude, longitude, arrivalTime, departureTime },
            { new: true }
        );
        if (!updatedTrain) {
            return res.status(404).json({ error: 'Train not found' });
        }
        res.status(200).json(updatedTrain);
    } catch (error) {
        res.status(400).json({ error: 'Unable to update train' });
    }
});

// Delete a train by ID (DELETE)
app.delete('/trains/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTrain = await Train.findByIdAndDelete(id);
        if (!deletedTrain) {
            return res.status(404).json({ error: 'Train not found' });
        }
        res.status(200).json({ message: 'Train deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete train' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
