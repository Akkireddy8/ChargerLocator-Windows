import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Favorites.css'; // Import the Favorites CSS file for styling

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [newFavorite, setNewFavorite] = useState('');

    useEffect(() => {
        // Fetch the existing favorites from the backend
        axios.get('http://localhost:5000/api/favorites')
            .then(response => setFavorites(response.data))
            .catch(error => console.error('Error fetching favorites:', error));
    }, []);

    const handleAddFavorite = async () => {
        if (!newFavorite.trim()) return;

        try {
            const response = await axios.post('http://localhost:5000/api/favorites', { name: newFavorite });
            setFavorites([...favorites, response.data]); // Update the state with new favorite
            setNewFavorite('');
        } catch (error) {
            console.error('Error adding favorite:', error);
        }
    };

    return (
        <div className="favorites-container">
            <h2>Favorites</h2>
            <input
                type="text"
                value={newFavorite}
                onChange={(e) => setNewFavorite(e.target.value)}
                placeholder="Add a favorite charger"
            />
            <button onClick={handleAddFavorite} className="add-button">Add</button>
            <ul className="favorites-list">
                {favorites.map((fav, index) => (
                    <li key={index} className="favorite-card">{fav.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Favorites;
