const fs = require('fs');
const mongoose = require('mongoose');
const Train = require('../models/trainschema'); 
const Route = require('../models/routeschema'); 

mongoose.connect('mongodb://localhost:27017/trainDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const railwayGeoJSON = JSON.parse(fs.readFileSync('railwayPath.geojson', 'utf8'));
const allPathCoordinates = railwayGeoJSON.features.map(feature => feature.geometry.coordinates);

const trains = {
  1: {
    id: 1,
    name: "Train A",
    pathCoordinates: allPathCoordinates[0],
    latitude: allPathCoordinates[0][0][1], 
    longitude: allPathCoordinates[0][0][0], 
    active: true,
    pathIndex: 0, 
    progress: 0 
  },
  2: {
    id: 2,
    name: "Train B",
    pathCoordinates: allPathCoordinates[1],
    latitude: allPathCoordinates[1][0][1], 
    longitude: allPathCoordinates[1][0][0], 
    active: true,
    pathIndex: 0, 
    progress: 0 
  }
};

const routes = allPathCoordinates.map((coordinates, index) => ({
  id: index + 1,
  coordinates: coordinates, 
  color: 'blue', 
  hasActiveTrain: false 
}));

function updateRouteActivity() {

  routes.forEach(route => route.hasActiveTrain = false);

  Object.values(trains).forEach(train => {
    if (train.active) {
      const routeIndex = allPathCoordinates.indexOf(train.pathCoordinates);
      if (routeIndex !== -1) {
        routes[routeIndex].hasActiveTrain = true;
      }
    }
  });
}

function saveRouteData() {
  updateRouteActivity();

  Route.insertMany(routes)
    .then(() => console.log('Routes saved to MongoDB with updated activity status'))
    .catch(err => console.error('Error saving routes:', err));
}

function moveTrainAlongPath(train) {
  if (!train.active) return;

  const currentIndex = train.pathIndex;
  const nextIndex = train.pathIndex + 1;

  if (nextIndex >= train.pathCoordinates.length) {
    train.active = false; 
    console.log(`Train ${train.name} has reached the end of the path.`);
    return;
  }

  const startPoint = train.pathCoordinates[currentIndex];
  const endPoint = train.pathCoordinates[nextIndex];

  train.progress += 0.005; 
  if (train.progress > 1) {
    train.pathIndex++;
    train.progress = 0;
    console.log(`Train ${train.name} advanced to segment ${train.pathIndex}`);
    return;
  }
  
  train.latitude = startPoint[1] + (endPoint[1] - startPoint[1]) * train.progress;
  train.longitude = startPoint[0] + (endPoint[0] - startPoint[0]) * train.progress;

  console.log(`Train ${train.name} moved to new position: (${train.latitude.toFixed(6)}, ${train.longitude.toFixed(6)})`);
}

function addRandomTrain() {
  if (Object.keys(trains).length >= 12) {
    console.log("Train limit reached. No more trains will be added.");
    return;
  }

  const randomPathIndex = Math.floor(Math.random() * allPathCoordinates.length);
  const pathCoordinates = allPathCoordinates[randomPathIndex];

  const newTrainId = Object.keys(trains).length + 1; 
  trains[newTrainId] = {
    id: newTrainId,
    name: `Train ${String.fromCharCode(64 + newTrainId)}`,
    pathCoordinates,
    latitude: pathCoordinates[0][1], 
    longitude: pathCoordinates[0][0], 
    active: true,
    pathIndex: 0, 
    progress: 0 
  };

  console.log(`Added new train: Train ${newTrainId}`);
}

function saveTrainData() {
  Object.values(trains).forEach(train => {
    moveTrainAlongPath(train);
    const trainData = new Train({
      id: train.id,
      name: train.name,
      latitude: train.latitude,
      longitude: train.longitude,
      timestamp: new Date(),
    });
    trainData.save();
  });

  saveRouteData(); 

  if (Math.random() < 0.1) {
    addRandomTrain();
  }
}

setInterval(saveTrainData, 10000); 
