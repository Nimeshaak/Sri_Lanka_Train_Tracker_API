// src/MapComponent.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapComponent = () => {
  const [trains, setTrains] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchTrainData = async () => {
      try {
        const trainResponse = await fetch('http://localhost:3000/trains');
        const trainData = await trainResponse.json();
        setTrains(trainData);

        const routeResponse = await fetch('http://localhost:3000/routes');
        const routeData = await routeResponse.json();
        setRoutes(routeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTrainData();
    const interval = setInterval(fetchTrainData, 10000); // Update every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const pathLayer = routes.filter(route => route.hasActiveTrain).map(route => ({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: route.coordinates.map(coord => [coord[0], coord[1]]) // [longitude, latitude]
    },
    properties: {
      color: route.color || 'blue'
    }
  }));

  return (
    <MapContainer center={[6.9271, 80.2741]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='© OpenStreetMap contributors'
      />
      {pathLayer.map((feature, index) => (
        <GeoJSON
          key={index}
          data={feature}
          style={{ color: feature.properties.color }}
        />
      ))}
      {trains.map(train => (
        <Marker
          key={train.id}
          position={[train.latitude, train.longitude]}
        >
          <Popup>
            <b>{train.name}</b>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
