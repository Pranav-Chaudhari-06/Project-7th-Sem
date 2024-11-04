import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password }, { withCredentials: true });
      console.log(res.data);
      if (res.data.success) {
        setMessage('Login successful!');
        localStorage.setItem('user', JSON.stringify(res.data.user)); // Save user data to localStorage
        navigate('/');
      } else {
        setMessage('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-75 mt-5">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group my-4">
            <label htmlFor="email" className="form-label text-lg">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group my-4">
            <label htmlFor="password" className="form-label text-lg">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="text-right mb-3">
            <Link to="/forgot-password" className="text-primary">Forgot Password?</Link>
          </div>
          <button type="submit" className="btn btn-custom w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {message && <div className="alert alert-info mt-4 text-center">{message}</div>}
          <div className="text-center my-5">
            Don't have an account?<Link to="/register" className="text-primary"> Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
