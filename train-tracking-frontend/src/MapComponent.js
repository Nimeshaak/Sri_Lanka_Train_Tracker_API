import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const movingTrainIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [34, 40], 
  iconAnchor: [20, 40], 
  popupAnchor: [0, -40] 
});

const MapComponent = () => {
  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoutes, setShowRoutes] = useState(false); 
  const [isSearching, setIsSearching] = useState(false); 
  const [noTrainsFound, setNoTrainsFound] = useState(false); 

  useEffect(() => {
    const fetchTrainData = async () => {
      try {
        const trainResponse = await fetch('http://localhost:3000/trains');
        const trainData = await trainResponse.json();
        const routeResponse = await fetch('http://localhost:3000/routes');
        const routeData = await routeResponse.json();

        const routesMap = routeData.reduce((acc, route) => {
          acc[route.id] = route; 
          return acc;
        }, {});

        const latestTrains = trainData.reduce((acc, train) => {
          acc[train.id] = {
            ...train,
            route: routesMap[train.routeId] 
          };
          return acc;
        }, {});

        const trainsArray = Object.values(latestTrains);
        setTrains(trainsArray);
        setFilteredTrains(trainsArray); 
      } catch (error) {
        console.error('Error fetching train data:', error);
      }
    };

    const fetchRouteData = async () => {
      try {
        const routeResponse = await fetch('http://localhost:3000/routes');
        const routeData = await routeResponse.json();
        
        const routesWithStyle = routeData.map(route => ({
          ...route,
          color: route.hasActiveTrain ? 'blue' : 'grey' 
        }));

        setRoutes(routesWithStyle);
      } catch (error) {
        console.error('Error fetching route data:', error);
      }
    };

    fetchTrainData();
    fetchRouteData();

    const interval = setInterval(() => {
      fetchTrainData();
      fetchRouteData();
    }, 60000); 

    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = trains.filter(train => 
      train.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredTrains(filtered);
    setIsSearching(lowercasedQuery.trim() !== ''); 
    setNoTrainsFound(filtered.length === 0 && lowercasedQuery.trim() !== ''); 
  }, [searchQuery, trains]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleToggleRoutes = () => {
    setShowRoutes(!showRoutes); 
  };

  const routeStyle = (feature) => ({
    color: feature.properties.color || 'grey', 
    weight: 2,
    opacity: 0.5
  });

  return (
    <div className="map-container">
      <h1 className="main-title">Sri Lanka Train Tracker</h1>
      <input
        type="text"
        placeholder="Search trains by name..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      <button
        onClick={handleToggleRoutes}
        className="toggle-routes-button"
      >
        {showRoutes ? 'Hide Train Routes' : 'Show Train Routes'}
      </button>
      {isSearching && noTrainsFound && (
        <p className="no-trains-message">No trains matched your search criteria.</p>
      )}
      <MapContainer center={[6.9271, 80.2741]} zoom={13} className="map">
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='© OpenStreetMap contributors'
        />
        {!isSearching && showRoutes && routes.length > 0 && (
          <GeoJSON
            data={{
              type: 'FeatureCollection',
              features: routes.map(route => ({
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: route.coordinates.map(coord => [coord[0], coord[1]]) 
                },
                properties: {
                  color: route.color
                }
              }))
            }}
            style={routeStyle}
          />
        )}
        {filteredTrains.map(train => (
          <Marker
            key={train.id}
            position={[train.latitude, train.longitude]}
            icon={movingTrainIcon} 
          >
            <Popup>
              <b>{train.name}</b><br />
              Latitude: {train.latitude.toFixed(6)}<br />
              Longitude: {train.longitude.toFixed(6)}<br />
              {train.route ? (
                <>
                  Route Name: {train.route.name}<br />
                  Route Color: <span style={{ color: train.route.color }}>{train.route.color}</span><br />
                  Route Details: {train.route.details || 'No additional details available'}
                </>
              ) : (
                'Route information not available'
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
