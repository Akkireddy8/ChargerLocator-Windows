import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ForgotPassword from './components/forgot-password';
import './front_styles.css';

function App() {
  return (
      <Router>
          <nav>
               <Link to="/login">Login</Link>
          </nav>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
      </Router>
  );
}

export default App;
