import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ForgotPassword from './components/forgot-password';
import './front_styles.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Check if token exists

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    setIsLoggedIn(false); // Update state
  };

  return (
    <Router>
      <div>
        <nav>
          {isLoggedIn ? (
            <>
              <Link to="/home">Home</Link>
              <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
        <Routes>
          <Route
            path="/"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
