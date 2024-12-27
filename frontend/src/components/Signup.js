
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5001/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, phone }),
      });

      if (response.ok) {
        navigate('/signin');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Sign-up failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSigninRedirect = () => {
    navigate('/signin');
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#121212', color: '#fff' }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          maxWidth: '400px',
          width: '100%',
          height:'auto',
          backgroundColor: '#1e1e1e',
          border: '1px solid #333',
          borderRadius: '10px',
        }}
      >
        <header className="sc-gjHHYa jpXQVz">
        <img src='/logo.png' alt="Logo" className="d-flex justify-content-center mx-auto img-fluid" style={{ maxWidth: '100px' }} /><h1 className="encore-text encore-text-title-large text-white text-center mb-5" data-encore-id="text">Sign up to start listening</h1></header>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
              style={{
                backgroundColor: '#2c2c2c',
                color: '#fff',
                border: '1px solid #555',
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label text-white">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              pattern="[0-9]{10}"
              className="form-control"
              style={{
                backgroundColor: '#2c2c2c',
                color: '#fff',
                border: '1px solid #555',
              }}
            />
            <small className="form-text text-muted text-white" style={{ color: '#ccc' }}>
              Enter a valid 10-digit phone number.
            </small>
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
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-3 text-white">
          <button
            type="button"
            className="btn btn-link"
            onClick={handleSigninRedirect}
            style={{ color: '#1db954' }}
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;


