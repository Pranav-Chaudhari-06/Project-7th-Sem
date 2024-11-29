import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [architects, setArchitects] = useState([]);
  const [models, setModels] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [modelCount, setModelCount] = useState(0);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '' });

  useEffect(() => {
    // Fetch architects data
    const fetchArchitects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/architects');
        if (res.data.success) {
          setArchitects(res.data.users);
          setUserCount(res.data.users.length);
        }
      } catch (error) {
        console.error('Error fetching architects:', error);
      }
    };

    // Fetch model details
    const fetchModels = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/all-requests', {withCredentials: true, });
        if (res.data.success) {
          setModels(res.data.requests);
          setModelCount(res.data.requests.length);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchArchitects();
    fetchModels();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setArchitects(architects.filter(user => user._id !== id)); // Update the local state
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${editingUserId}`, editedUser);
      if (res.data.success) {
        setArchitects(architects.map(user => user._id === editingUserId ? res.data.user : user));
        setEditingUserId(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>
      <div className="dashboard-overview">
        <div className="card">
          <h2>Users</h2>
          <p>{userCount}</p>
        </div>
        <div className="card">
          <h2>Models</h2>
          <p>{modelCount}</p>
        </div>
        <div className="card">
          <h2>Income</h2>
          <p>₹0</p>
        </div>
      </div>

      {/* Architects Section */}
      <div className="dashboard-section">
        <h2>Architects</h2>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {architects.map(user => (
                <tr key={user._id.toString()}>
                  <td>
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editedUser.firstName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      user.firstName
                    )}
                  </td>
                  <td>
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editedUser.lastName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      user.lastName
                    )}
                  </td>
                  <td>
                    {editingUserId === user._id ? (
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={editedUser.phoneNumber}
                        onChange={handleInputChange}
                      />
                    ) : (
                      user.phoneNumber
                    )}
                  </td>
                  <td>
                    {editingUserId === user._id ? (
                      <button onClick={handleSave} className="btn btn-success btn-sm">Save</button>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(user)} className="btn btn-primary btn-sm me-2">Edit</button>
                        <button onClick={() => handleDelete(user._id)} className="btn btn-danger btn-sm">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Models Section */}
      <div className="dashboard-section">
        <h2>Models</h2>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Model Type</th>
                <th>Description</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Architect</th>
              </tr>
            </thead>
            <tbody>
              {models.map(model => (
                <tr key={model._id.toString()}>
                  <td>{model.modelType}</td>
                  <td>{model.description}</td>
                  <td>{model.urgency}</td>
                  <td>{model.status || 'Pending'}</td>
                  <td>{`${model.architectId.firstName} ${model.architectId.lastName}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
