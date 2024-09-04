import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';
import logo from './images/image.png'; // Adjust the path to your logo

function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    axios.post('http://localhost:8000/logout', {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        navigate('/'); // Redirect to home page after logout
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Advanced RAG Playground</h1>
      </div>
      <nav className="navigation">
        <Link to="/">Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/chat">Chat</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
