
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context';
import 'bootstrap/dist/css/bootstrap.min.css';

function Signin() {
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        login(token);
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Sign-in failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#201B1B', color: '#fff' }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: '#1e1e1e',
          border: '3px solid #333',
          borderRadius: '30px',
        }}
      >
        
        <header className="sc-gjHHYa jpXQVz">
        <img src='/logo.png' alt="Logo" className="d-flex justify-content-center mx-auto img-fluid" style={{ maxWidth: '100px' }} /><h1 className="encore-text encore-text-title-large text-white text-center mb-5" data-encore-id="text">Sign In SpotiFy</h1></header>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="identifier" className="form-label text-white">
              Email or Phone Number
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="Enter email or phone number"
              className="form-control"
              style={{
                '::placeholder': { color: 'gray' },
                backgroundColor: '#2c2c2c',
                color: '#fff',
                border: '2px solid #555',
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-white">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              style={{
                backgroundColor: '#2c2c2c',
                color: '#fff',
                border: '1px solid #555',
              }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
            style={{ backgroundColor: '#1db954', border: 'none' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-3 text-white">
          <button
            type="button"
            className="btn btn-link"
            onClick={handleSignupRedirect}
            style={{ color: '#1db954' }}
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signin;



