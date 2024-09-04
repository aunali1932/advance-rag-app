import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null); // Handle errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Make a POST request to your FastAPI signup endpoint
      const response = await axios.post('http://localhost:8000/signup', {
        username: username,
        password: password,
      });

      // If signup is successful, navigate to the login page
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      // Handle errors, e.g., username already taken
      setError(error.response?.data?.detail || 'Signup failed.');
    }
  };

  return (
    <div className="signup">
      <h2>Sign Up</h2>
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
        
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
