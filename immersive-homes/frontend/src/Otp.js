import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Otp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;

    // Move focus to the next input field
    if (e.target.value.length === 1 && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    setOtp(newOtp);
  };

  const handleKeyDown = (e, index) => {
    // Move focus to the previous input field
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpString = otp.join('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/verify-otp', { email, otp: otpString });
      console.log(res.data);
      setMessage('OTP verified successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      setMessage('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '40px',
    height: '40px',
    textAlign: 'center',
    fontSize: '18px',
    marginRight: '8px',
    borderRadius: '5px',
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-75 mt-5">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">OTP Verification</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group my-4">
            <div className="d-flex flex-wrap justify-content-center">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  style={inputStyle}
                  value={value}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  required
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ padding: '10px', fontSize: '16px' }}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          {message && <div className="alert alert-info mt-4 text-center">{message}</div>}
          <div className="text-center my-4">
            <Link to="/resend-otp" className="text-primary">Resend OTP</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
