import React from 'react';  // Import React to use JSX
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';  // Import routing components for navigation
import Login from './components/Login';  // Import Login component
import Register from './components/Register';  // Import Register component
import Home from './components/Home';  // Import Home component (currently unused in the routing)
import ForgotPassword from './components/forgot-password';  // Import ForgotPassword component
import './front_styles.css';  // Import CSS file for styling
 
function App() {
  return (
<Router>  {/* Wrap the app in Router for enabling routing functionality */}
<nav>  {/* Navigation bar for linking to different routes */}
<Link to="/login">Login</Link>  {/* Link to the login page */}
</nav>
          {/* Define routes for different components */}
<Routes>
              {/* Route for the login page */}
<Route path="/" element={<Login />} />
              {/* Route for the login page (direct link) */}
<Route path="/login" element={<Login />} />
              {/* Route for the register page */}
<Route path="/register" element={<Register />} />
              {/* Route for the forgot-password page */}
<Route path="/forgot-password" element={<ForgotPassword />} />
</Routes>
</Router>
  );
}
 
export default App;
