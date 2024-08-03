import React from 'react';
import './Login.css';

export default function Login() {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-75 mt-5">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form>
          <div className="form-group my-5">
            <label htmlFor="email" className="form-label text-lg">Email:</label>
            <input type="email" className="form-control" id="email" placeholder="Enter email" />
          </div>
          <div className="form-group my-5">
            <label htmlFor="password" className="form-label text-lg">Password:</label>
            <input type="password" className="form-control" id="password" placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-custom w-100">Login</button>
          <div className="text-center my-5">
            <a href="#signup" className="text-primary">Don't have an account? Sign up</a>
          </div>
        </form>
      </div>
    </div>
  )
}
