const express = require('express');
const multer = require('multer');
const ModelRequest = require('../models/ModelRequest');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const fileFilter = (req, file, cb) => {
  const validMimeTypes = ['application/pdf', 'application/vnd.dwg'];
  if (validMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf and .cad files are allowed'), false);
  }
};
const upload = multer({ storage, fileFilter });

// Model request submission
router.post('/request', upload.single('file'), async (req, res) => {
  try {
    // Ensure the user is logged in and is an Architect
    if (!req.session.user || req.session.user.role !== 'Architect') {
      return res.status(403).json({ message: 'Access denied: Architects only' });
    }

    const { modelType, description, urgency } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const newRequest = new ModelRequest({
      architectId: req.session.user.id,
      modelType,
      description,
      urgency,
      fileUrl: req.file.path,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Model request submitted successfully' });
  } catch (error) {
    console.error('Error submitting model request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route: Fetch all model requests for Admins
router.get('/all-requests', async (req, res) => {
  try {
    // Ensure the user is logged in and is an Admin
    if (!req.session.user || req.session.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const requests = await ModelRequest.find().populate('architectId', 'firstName lastName email');
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching all model requests:', error);
    res.status(500).json({ message: 'Failed to fetch model requests' });
  }
});

// Route: Fetch model requests for the logged-in Architect
router.get('/requests', async (req, res) => {
  try {
    console.log('Session User:', req.session.user);
    // Ensure the user is logged in and is an Architect
    if (!req.session.user || req.session.user.role !== 'Architect') {
      return res.status(403).json({ message: 'Access denied: Architects only' });
    }

    const architectId = req.session.user.id;
    const requests = await ModelRequest.find({ architectId });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching model requests:', error);
    res.status(500).json({ message: 'Failed to fetch model requests' });
  }
});

// Route: Update model request status
router.put('/update-status/:id', async (req, res) => {
  try {
    // Ensure the user is logged in and is an Admin
    if (!req.session.user || req.session.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const { status } = req.body;
    const requestId = req.params.id;

    const updatedRequest = await ModelRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Model request not found' });
    }

    res.status(200).json({ message: 'Model request status updated successfully', request: updatedRequest });
  } catch (error) {
    console.error('Error updating model request status:', error);
    res.status(500).json({ message: 'Failed to update model request status' });
  }
});

// View all model requests by Architects
router.get('/my-requests', async (req, res) => {
  try {
    // Ensure the user is logged in and is an Architect
    if (!req.session.user || req.session.user.role !== 'Architect') {
      return res.status(403).json({ message: 'Access denied: Architects only' });
    }

    const requests = await ModelRequest.find({ architectId: req.session.user.id });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching model requests:', error);
    res.status(500).json({ message: 'Failed to fetch model requests' });
  }
});

// Check session
router.get('/session', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

module.exports = router;
