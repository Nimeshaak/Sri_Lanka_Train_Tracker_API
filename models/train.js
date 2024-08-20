const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  trainID: {
    type: String,
    required: true,
    unique: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  arrivalTime: {
    type: String,  
    required: true
  },
  departureTime: {
    type: String, 
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Train', trainSchema);
