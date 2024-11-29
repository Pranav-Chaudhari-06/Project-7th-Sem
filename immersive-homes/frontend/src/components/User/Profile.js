import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import './Profile.css'; // Add your custom CSS for styling

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    age: '',  // Use age instead of dob
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
          age: response.data.user.age, // Fetch age
          gender: response.data.user.gender,
          phoneNumber: response.data.user.phoneNumber,
          email: response.data.user.email,
          password: '', // Do not display the hashed password
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

  const showAddAddressModal = () => {
    setIsModalVisible(true);
  };

  const closeAddAddressModal = () => {
    setIsModalVisible(false);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileDetails user={user} isEditing={isEditing} editForm={editForm} handleInputChange={handleInputChange} handleSaveClick={handleSaveClick} handleEditClick={handleEditClick} />;
      case 'orders':
        return <OrderDetails />;
      case 'addressBook':
        return <AddressBook showAddAddressModal={showAddAddressModal} />;
      default:
        return null;
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <section className="my-5">
      <div>
        <div className="main-body">
          <div className="row">
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className="mt-3">
                      <h4>{user.firstName} {user.lastName}</h4>
                      <p className="text-secondary mb-1">{user.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="list-group list-group-flush text-center mt-4">
                    <button className={`list-group-item list-group-item-action border-0 ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => setActiveSection('profile')}>Profile Information</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
      {isModalVisible && <AddAddressModal closeModal={closeAddAddressModal} />}
    </section>
  );
};

const ProfileDetails = ({ user, isEditing, editForm, handleInputChange, handleSaveClick, handleEditClick }) => (
  <div className="card">
    <div className="card-body">
      {isEditing ? (
        <>
          <h5>Edit Profile Information</h5>
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
          <h5>Profile Information</h5>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Age:</strong> {user.age} years</p>
          <p><strong>Email Address:</strong> {user.email}</p>
          <p><strong>Contact:</strong> {user.phoneNumber}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <Button className="btn btn-primary mt-3" onClick={handleEditClick}>
            Edit Profile
          </Button>
        </>
      )}
    </div>
  </div>
);

const OrderDetails = () => (
  <div className="order_card">
    {/* Existing order details structure */}
  </div>
);

const AddressBook = ({ showAddAddressModal }) => (
  <div className="card">
    <div className="card-body">
      <h5>Address Book</h5>
      <button className="add_address_button" onClick={showAddAddressModal}>Add Address</button>
    </div>
  </div>
);

const AddAddressModal = ({ closeModal }) => (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={closeModal}>&times;</span>
      <h2>Add Address</h2>
      <form id="addAddressForm">
        <div className="button_div">
          <button type="submit">Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
);

export default Profile;
