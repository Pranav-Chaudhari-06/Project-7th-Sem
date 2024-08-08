import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { newPassword: password });
      if (res.data.success) {
        setMessage('Password reset successful!');
        navigate('/login');
      } else {
        setMessage(res.data.message || 'Error resetting password');
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
        <h3 className="text-center mb-4">Reset Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group my-4">
            <label htmlFor="password" className="form-label text-lg">New Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group my-4">
            <label htmlFor="confirmPassword" className="form-label text-lg">Confirm New Password:</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-custom w-100" disabled={loading}>
            {loading ? 'Resetting password...' : 'Reset Password'}
          </button>
          {message && <div className="alert alert-info mt-4 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
}
