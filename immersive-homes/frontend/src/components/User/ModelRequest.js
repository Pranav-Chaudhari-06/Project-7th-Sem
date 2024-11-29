import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ModelRequest = () => {
  const [modelType, setModelType] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Low');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validExtensions = ['.pdf', '.cad'];
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(`.${fileExtension}`)) {
      setMessage('Only .pdf and .cad files are allowed.');
      setFile(null);
    } else {
      setMessage('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please upload a .pdf or .cad file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('modelType', modelType);
      formData.append('description', description);
      formData.append('urgency', urgency);
      formData.append('file', file);

      const response = await axios.post(
        'http://localhost:5000/api/users/request',
        formData,
        { withCredentials: true } // Enable cookies for session
      );

      setMessage(response.data.message);
      setModelType('');
      setDescription('');
      setUrgency('Low');
      setFile(null);
      navigate('/my-requests'); // Redirect after submission
    } catch (error) {
      console.error('Error submitting model request:', error);
      setMessage('Failed to submit model request.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Submit Model Request</h2>
        {message && (
          <div
            className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'}`}
            role="alert"
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="modelType" className="form-label">
              Model Type:
            </label>
            <input
              type="text"
              className="form-control"
              id="modelType"
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              required
              placeholder="Enter model type"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              className="form-control"
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Provide a detailed description"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="urgency" className="form-label">
              Urgency:
            </label>
            <select
              className="form-select"
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="file" className="form-label">
              Upload File (.pdf or .cad):
            </label>
            <input
              type="file"
              className="form-control"
              id="file"
              accept=".pdf,.cad"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModelRequest;
