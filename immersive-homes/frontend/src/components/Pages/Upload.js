// src/components/ArchitectRequests.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/requests',{withCredentials: true, });
        setRequests(response.data.requests);
      } catch (error) {
        console.error('Error fetching model requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleNewRequest = () => {
    navigate('/upload/new'); // Navigate to the form
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Model Requests</h2>
        <button className="btn btn-primary" onClick={handleNewRequest}>
          Add New Request
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No model requests found. Click "Add New Request" to create one.
        </div>
      ) : (
        <div className="row">
          {requests.map((request) => (
            <div className="col-md-6 mb-4" key={request._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Model Type: {request.modelType}</h5>
                  <p className="card-text">
                    <strong>Description:</strong> {request.description}
                  </p>
                  <p className="card-text">
                    <strong>Urgency:</strong> {request.urgency}
                  </p>
                  <p className={`card-text ${request.status === 'Completed' ? 'text-success' : 'text-warning'}`}>
                    <strong>Status:</strong> {request.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Upload;
