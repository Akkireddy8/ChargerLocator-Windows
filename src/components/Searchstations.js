import React, { useState } from 'react';
import axios from 'axios';
import './Searchstations.css'; // Import CSS file for styling

function SearchStations() {
    const [search, setSearch] = useState('');
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!search.trim()) {
            setError('Please enter a location or keyword.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            // Replace with your actual backend API endpoint
            const response = await axios.get(`http://localhost:5000/api/stations?query=${search}`);
            setStations(response.data);
        } catch (err) {
            setError('Error fetching stations. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-stations-container">
            <h2>Find Charging Stations</h2>

            <div className="search-bar">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Enter location or keyword"
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {error && <p className="error">{error}</p>}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="station-list">
                    {stations.length > 0 ? (
                        stations.map((station) => (
                            <div key={station.id} className="station-card">
                                <h3>{station.name}</h3>
                                <p>{station.address}</p>
                                <p>{station.contact}</p>
                            </div>
                        ))
                    ) : (
                        <p>No stations found. Try a different search.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchStations;
