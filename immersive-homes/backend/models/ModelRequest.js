// Backend/models/ModelRequest.js
const mongoose = require('mongoose');

const modelRequestSchema = new mongoose.Schema(
  {
    architectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model to link requests to the architect
      required: true,
    },
    modelType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High'], // Example urgency levels; can be adjusted
      required: true,
    },
    fileUrl: {
      type: String,
      required: true, // Make this required since the file upload is now part of the request
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'In Progress', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('ModelRequest', modelRequestSchema,'model_requests');
