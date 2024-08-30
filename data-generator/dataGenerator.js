const { faker } = require('@faker-js/faker');
const axios = require('axios');

function moveTrainWithinSriLanka(train) {
  const speed = 0.005; 

  const randomCurve = faker.number.float({ min: -0.001, max: 0.001 });
  const directionChange = faker.number.float({ min: -0.0005, max: 0.0005 });

  train.directionLat += directionChange;
  train.directionLon += directionChange;

  let deltaLat = speed * train.directionLat + randomCurve;
  let deltaLon = speed * train.directionLon + randomCurve;

  let newLat = train.latitude + deltaLat;
  let newLon = train.longitude + deltaLon;

  if (newLat < 5.8 || newLat > 9.8) {
    deltaLat *= -1; 
    newLat = train.latitude + deltaLat;
  }

  if (newLon < 79.5 || newLon > 82.0) {
    deltaLon *= -1; 
    newLon = train.longitude + deltaLon;
  }

  return {
    latitude: parseFloat(newLat.toFixed(6)),
    longitude: parseFloat(newLon.toFixed(6)),
    directionLat: train.directionLat,
    directionLon: train.directionLon,
  };
}

const trains = [
  { id: 1, name: "Train A", latitude: 6.9271, longitude: 79.8612, directionLat: 0.001, directionLon: 0.001, active: true }, // Colombo
  { id: 2, name: "Train B", latitude: 7.2906, longitude: 80.6337, directionLat: 0.001, directionLon: 0.001, active: true }, // Kandy
  { id: 3, name: "Train C", latitude: 6.0535, longitude: 80.2210, directionLat: 0.001, directionLon: 0.001, active: true }, // Galle
];

function generateAdditionalTrains(count) {
  for (let i = 0; i < count; i++) {
    const id = trains.length + 1;
    const name = `Train ${String.fromCharCode(68 + i)}`; 
    const latitude = faker.number.float({ min: 5.8, max: 9.8 });
    const longitude = faker.number.float({ min: 79.5, max: 82.0 });

    trains.push({
      id,
      name,
      latitude,
      longitude,
      directionLat: 0.001,
      directionLon: 0.001,
      active: false,
    });
  }
}

const additionalTrainCount = faker.number.int({ min: 1, max: 5 });
generateAdditionalTrains(additionalTrainCount);

function startRandomTrain() {
  const inactiveTrains = trains.filter(train => !train.active);
  if (inactiveTrains.length > 0) {
    const randomIndex = faker.number.int({ min: 0, max: inactiveTrains.length - 1 });
    const trainToStart = inactiveTrains[randomIndex];
    trainToStart.active = true;
    trainToStart.startedAt = Date.now(); 
    console.log(`Starting ${trainToStart.name}`);
  }
}

function stopRandomTrain() {
  const activeTrains = trains.filter(train => train.active && train.id > 3); 
  if (activeTrains.length > 0) {
    const trainsToStop = activeTrains.filter(train => {
      return Date.now() - train.startedAt > 60000; 
    });

    if (trainsToStop.length > 0) {
      const randomIndex = faker.number.int({ min: 0, max: trainsToStop.length - 1 });
      const trainToStop = trainsToStop[randomIndex];
      trainToStop.active = false;
      console.log(`Stopping ${trainToStop.name}`);
    }
  }
}

function simulateTrainMovements() {
  setInterval(() => {
    trains.forEach((train) => {
      if (train.active) {
        const { latitude, longitude, directionLat, directionLon } = moveTrainWithinSriLanka(train);
        train.latitude = latitude;
        train.longitude = longitude;
        train.directionLat = directionLat;
        train.directionLon = directionLon;

        const data = {
          trainId: train.id,
          trainName: train.name,
          timestamp: new Date().toISOString(),
          location: { latitude, longitude },
        };
        console.log('Generated data:', data);

        axios.post('http://localhost:3000/trains', data)
          .then(response => console.log('Data sent successfully'))
          .catch(error => console.error('Error sending data:', error));
      }
    });
  }, 30000); 
}

simulateTrainMovements();

setInterval(() => {
  startRandomTrain();
  stopRandomTrain();
}, 60000);
