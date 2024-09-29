import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    phoneNumber: '',
    email: '',
    password: '',
    role: ''
  });

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/session', { withCredentials: true });
        setUser(response.data.user);
        setEditForm({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          age: response.data.user.age,
          gender: response.data.user.gender,
          phoneNumber: response.data.user.phoneNumber,
          email: response.data.user.email,
          password: response.data.user.password,
          role: response.data.user.role
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveClick = async () => {
    try {
      await axios.put('http://localhost:5000/api/users/profile', editForm, { withCredentials: true });
      setUser(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page container-fluid">
      <div className="row">
        <div className="col-lg-3 col-md-4 sidebar">
          <div className="card text-center">
            <div className="card-body">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
              />
              <h3>{user.firstName} {user.lastName}</h3>
              <p><strong>Role:</strong> {user.role}</p>
              <button className="btn btn-primary" onClick={handleEditClick}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-9 col-md-8 content">
          <div className="card">
            <div className="card-body">
              {isEditing ? (
                <>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>Age</label>
                      <input
                        type="number"
                        name="age"
                        value={editForm.age}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Gender</label>
                      <select
                        name="gender"
                        value={editForm.gender}
                        onChange={handleInputChange}
                        className="form-control"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={editForm.phoneNumber}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={editForm.password}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      name="role"
                      value={editForm.role}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <button className="btn btn-success" onClick={handleSaveClick}>
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <h5>Profile Details</h5>
                  <p><strong>First Name:</strong> {user.firstName}</p>
                  <p><strong>Last Name:</strong> {user.lastName}</p>
                  <p><strong>Age:</strong> {user.age}</p>
                  <p><strong>Gender:</strong> {user.gender}</p>
                  <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Password:</strong> {user.password}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
