import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainList = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await axios.get('http://localhost:3000/trains');
        setTrains(response.data);
      } catch (error) {
        console.error('Error fetching trains:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
    const interval = setInterval(fetchTrains, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Train Locations</h1>
      <ul>
        {trains.map((train) => (
          <li key={train._id}>
            <strong>{train.name}</strong><br />
            Train ID: {train.trainID}<br />
            Latitude: {train.latitude}<br />
            Longitude: {train.longitude}<br />
            Arrival Time: {train.arrivalTime}<br />
            Departure Time: {train.departureTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainList;
