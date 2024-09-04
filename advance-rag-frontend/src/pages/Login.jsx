import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios'; // Import axios
import './Login.css';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // To handle errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Make a POST request to your FastAPI login endpoint
      const response = await axios.post('http://localhost:8000/login', {
        username: username,
        password: password,
      }, {
        withCredentials: true // Ensure cookies are sent and received
      });

      // If successful, set isLoggedIn state and navigate to the chat page
      if (response.status === 200) {
        setIsLoggedIn(true);  // Update state to reflect logged-in status
        navigate('/chat');
      }
    } catch (error) {
      // Handle error, such as incorrect login
      setError(error.response?.data?.detail || 'Login failed.');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>} {/* Display error */}
        
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit">Log In</button>
      </form>
      
      <p className="signup-prompt">
        Not a user? <Link to="/signup">Sign up here!</Link>
      </p> {/* Signup prompt */}
    </div>
  );
}

export default Login;
