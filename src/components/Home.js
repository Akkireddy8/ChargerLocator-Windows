import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchStations from './Searchstations';
import './Home.css'; // Import the CSS file for styling

function Home() {
    const navigate = useNavigate();

    const handleFindStations = () => {
        navigate('/search-stations'); // Redirect to the search stations page
    };

    const handleFavoritesClick = () => {
        navigate('/favorites');
    };
    
    return (
        <div className="home-container">
            <button onClick={handleFindStations} className="find-button">
                Find Stations
            </button>
            <button onClick={handleFavoritesClick} className="find-button">
                Go to Favorites
            </button>
        </div>
    );
}

export default Home;
