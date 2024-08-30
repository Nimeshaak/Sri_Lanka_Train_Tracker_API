const mongoose = require('mongoose');

// Route schema
const routeSchema = new mongoose.Schema({
  id: Number,
  coordinates: [[Number]], 
  color: String,
  hasActiveTrain: Boolean 
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
