import React from 'react';
import { useParams } from 'react-router-dom';
import './StationDetails.css'; // Import CSS for styling

function StationDetails({ stations }) {
    const { stationId } = useParams();
    const station = stations.find(st => st.id.toString() === stationId);

    if (!station) {
        return <h2>Station not found</h2>;
    }

    return (
        <div className="station-details-container">
            <h2>{station.name}</h2>
            <p><strong>Address:</strong> {station.address}</p>
            <p><strong>Contact:</strong> {station.contact}</p>
            <p><strong>Charging Type:</strong> {station.chargingType}</p>
            <p><strong>Availability:</strong> {station.availability}</p>
        </div>
    );
}

export default StationDetails;