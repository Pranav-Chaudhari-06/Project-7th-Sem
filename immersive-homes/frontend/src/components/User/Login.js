import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validate form before submitting
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/login', { email, password }, { withCredentials: true }
      );
     
      if (res.data.success) {
        console.log(res.data);
        const user = res.data.user;
        const token = res.data.token;
        setMessage('Login successful!');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); // Save user data to localStorage

        // Redirect based on user role
        if (user.role === 'Admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'Architect') {
          navigate('/');
        } else {
          navigate('/');
        }
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
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="form-group my-4">
            <label htmlFor="password" className="form-label text-lg">Password:</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="text-right mb-3">
            <Link to="/forgot-password" className="text-primary">Forgot Password?</Link>
          </div>
          <button type="submit" className="btn btn-custom w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {message && <div className="alert alert-info mt-4 text-center">{message}</div>}
          <div className="text-center my-5">
            Don't have an account?
            <Link to="/register" className="text-primary"> Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
