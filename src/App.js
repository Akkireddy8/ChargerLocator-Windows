import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ForgotPassword from './components/forgot-password';
import SearchStations from './components/Searchstations';
import Favorites from './components/Favorites';
import backgroundImage from './background_img.jpg'; // Ensure it's inside src/

import './front_styles.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Check if token exists

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    setIsLoggedIn(false); // Update state
  };

  // Conditionally apply background image only for login page
  const isLoginPage = window.location.pathname === '/';

  return (
    <Router>
      <div
        style={{
          backgroundImage: isLoginPage ? `url(${backgroundImage})` : 'none', // Apply only on the login page
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100%',
          overflow: 'auto',
        }}
      >
        <header style={{ textAlign: 'center', padding: '10px 0', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
          <h1 style={{ margin: 0 }}>ChargeFinder</h1>
        </header>
        <nav>
          {isLoggedIn ? (
            <>
              <Link to="/home">Home</Link>
              <Link to="/" onClick={handleLogout} style={{ marginLeft: '10px', textDecoration: 'none', color: 'blue' }}>
                Logout
              </Link>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search-stations" element={<SearchStations />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
