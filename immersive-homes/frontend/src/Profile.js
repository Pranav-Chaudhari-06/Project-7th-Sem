import React from 'react';
import './Profile.css';

export default function Profile() {
  // Sample user data (replace with real data from your state or props)
  const user = {
    username: 'johndoe',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    profilePicture: 'https://via.placeholder.com/150', // Replace with user's profile picture URL
  };

  return (
    <div className="container profile-container">
      <div className="row profile-header align-items-center">
        <div className="col-md-3 text-center">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="profile-picture img-fluid rounded-circle"
          />
        </div>
        <div className="col-md-9">
          <h1 className="profile-name">{user.name}</h1>
          <h4 className="profile-username">@{user.username}</h4>
          <p className="profile-email">{user.email}</p>
          <p className="profile-phone"><strong>Phone:</strong> {user.phoneNumber}</p>
          <a href="#editProfile" className="btn btn-primary">Edit Profile</a>
        </div>
      </div>
      <div className="profile-nav mt-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#orders">Orders</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#wishlist">Wishlist</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#addresses">Addresses</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#payment">Payment Methods</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#settings">Account Settings</a>
          </li>
        </ul>
      </div>
      <div className="profile-content mt-4">
        <div id="orders" className="profile-section">Orders content</div>
        <div id="wishlist" className="profile-section">Wishlist content</div>
        <div id="addresses" className="profile-section">Addresses content</div>
        <div id="payment" className="profile-section">Payment Methods content</div>
        <div id="settings" className="profile-section">Account Settings content</div>
      </div>
    </div>
  );
}
