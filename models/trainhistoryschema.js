const mongoose = require('mongoose');

const trainHistorySchema = new mongoose.Schema({
  trainId: Number,
  name: String,
  latitude: Number,
  longitude: Number,
  timestamp: Date
});

const TrainHistory = mongoose.model('TrainHistory', trainHistorySchema);
module.exports = TrainHistory;
