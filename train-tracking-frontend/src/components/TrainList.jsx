import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

const trainIcon = new L.Icon({
  iconUrl: 'https://w7.pngwing.com/pngs/959/926/png-transparent-location-icon-computer-icons-location-google-maps-location-angle-map-symbol-thumbnail.png', // Example icon URL
  iconSize: [25, 25],
});

const MapComponent = () => {
  const [trainData, setTrainData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://localhost:3000/trains')
        .then(response => {
          setTrainData(response.data);
        })
        .catch(error => console.error('Error fetching train data:', error));
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={[7.0, 80.0]} zoom={8} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {trainData.map((train) => (
        <Marker
          key={train._id} 
          position={[train.location.latitude, train.location.longitude]}
          icon={trainIcon}
        >
          <Popup>
            <div>
              <h3>{train.trainName}</h3>
              <p>Train ID: {train.trainId}</p>
              <p>Latitude: {train.location.latitude}</p>
              <p>Longitude: {train.location.longitude}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
