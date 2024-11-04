import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      setMessage(res.data.message);
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
        <h3 className="text-center mb-4">Forgot Password</h3>
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
          <button type="submit" className="btn btn-custom w-100" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          {message && <div className="alert alert-info mt-4 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
}
