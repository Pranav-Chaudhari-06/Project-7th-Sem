// src/components/AdminRequests.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/all-requests', {withCredentials: true, });
        setRequests(response.data.requests);
      } catch (error) {
        console.error('Error fetching model requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const downloadFile = async (fileUrl) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(fileUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileUrl.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-center mb-4">Architect Model Requests</h2>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : requests.length === 0 ? (
        <Alert variant="info" className="text-center">
          No model requests found.
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table bordered hover className="table-striped">
            <thead className="table-dark">
              <tr>
                <th>Request ID</th>
                <th>Model Type</th>
                <th>Description</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request._id}</td>
                  <td>{request.modelType}</td>
                  <td>{request.description}</td>
                  <td>{request.urgency}</td>
                  <td className={request.status === 'Completed' ? 'text-success' : 'text-warning'}>
                    {request.status}
                  </td>
                  <td>
                    {request.fileUrl ? (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => downloadFile(request.fileUrl)}
                      >
                        Download File
                      </Button>
                    ) : (
                      <span className="text-muted">No File</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ViewRequests;
