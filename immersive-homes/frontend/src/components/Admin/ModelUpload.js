import React, { useState } from 'react';
import axios from 'axios';

export default function ModelUpload() {
  const [modelName, setModelName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [modelFile, setModelFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => setModelFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Form validation
    if (!modelFile) {
      setMessage('Please select a 3D model file to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('modelName', modelName);
      formData.append('description', description);
      formData.append('tags', tags);
      formData.append('modelFile', modelFile);

      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await axios.post('http://localhost:5000/adminModels/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
      setModelName('');
      setDescription('');
      setTags('');
      setModelFile(null);
    } catch (error) {
      console.error('Error uploading model:', error);
      setMessage('Failed to upload model. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Upload 3D Model</h2>
        {message && <div className="alert alert-info text-center">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="modelName" className="form-label">Model Name:</label>
            <input
              type="text"
              className="form-control"
              id="modelName"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description:</label>
            <textarea
              className="form-control"
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tags" className="form-label">Tags (comma-separated):</label>
            <input
              type="text"
              className="form-control"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="modelFile" className="form-label">Upload 3D Model File:</label>
            <input
              type="file"
              className="form-control"
              id="modelFile"
              accept=".glb,.fbx,.obj"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary">Upload Model</button>
          </div>
        </form>
      </div>
    </div>
  );
}
