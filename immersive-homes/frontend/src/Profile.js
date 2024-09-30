import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import './Profile.css'; // Add your custom CSS for styling

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
    password: '', // This will still hold the hashed password
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
          password: '', // Do not display the hashed password, leave this empty
          role: response.data.user.role
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
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
    <div className="profile-page">
      {/* Profile Details */}
      <div className="profile-content container-fluid">
        <div className="row">
          <div className="col-lg-9 col-md-8 content">
            <Card className="profile-details-card my-4">
              <Card.Body>
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
                        placeholder="Enter new password"
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
                    <Button className="btn btn-success" onClick={handleSaveClick}>
                      Save Changes
                    </Button>
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
                    <p><strong>Password:</strong> <i>Password is hidden for security reasons</i></p> {/* Password Hidden */}
                    <p><strong>Role:</strong> {user.role}</p>
                  </>
                )}
              </Card.Body>
              <Button className="btn btn-primary edit-profile-btn" onClick={handleEditClick}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
