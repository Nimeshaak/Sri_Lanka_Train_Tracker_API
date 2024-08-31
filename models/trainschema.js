const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  id: Number,
  name: String,
  latitude: Number,
  longitude: Number,
  timestamp: Date,
});

const Train = mongoose.model('Train', trainSchema);

module.exports = Train;
