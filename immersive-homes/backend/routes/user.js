const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const User = require('../models/User');
const ModelRequest = require('../models/ModelRequest');

const router = express.Router();

// Hardcoded sensitive data (replace these with your actual values)
const EMAIL_USER = '21bmiit096@gmail.com';
const EMAIL_PASS = 'thgccrbktampmmjb';
const FRONTEND_URL = 'http://localhost:3000';

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

// --- Existing User Routes --- //
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Regenerate session ID to prevent fixation attacks
    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ success: false, message: 'Session error' });

      // Set session data
      req.session.user = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phoneNumber:user.phoneNumber,
        role: user.role,
      };

      res.json({
        success: true,
        user: {
          id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phoneNumber:user.phoneNumber,
        role: user.role,
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to log out' });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Register Route
router.post('/register', async (req, res) => {
  const { firstName, lastName, age, gender, phoneNumber, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      age,
      gender,
      phoneNumber,
      email,
      password: hashedPassword, // Store the hashed password
      role
    });

    // Generate and set OTP
    const otp = generateOtp();
    user.otp = otp;

    await user.save();

    // Send OTP
    sendOtpEmail(user.email, otp);

    return res.status(201).json({ message: 'User registered successfully. An OTP has been sent to your email.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;
    sendResetEmail(user.email, resetUrl);

    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile Update Route
router.put('/profile', async (req, res) => {
  const { firstName, lastName, age, gender, phoneNumber, email, password, role } = req.body;
  try {
    const userId = req.session.user.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    // Update session data
    req.session.user = {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      age: updatedUser.age,
      gender: updatedUser.gender,
      phoneNumber: updatedUser.phoneNumber,
      email: updatedUser.email,
      role: updatedUser.role,
    };

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Session Check Route
router.get('/session', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

// Fetch Architects Route
router.get('/architects', async (req, res) => {
  try {
    const architects = await User.find({ role: 'Architect' });
    res.status(200).json({ success: true, users: architects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete User by ID
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update User by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && user.otp === otp) {
      user.otp = '';
      await user.save();

      // Set up session and cookie
      req.session.user = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
      };

      res.json({ success: true, message: 'OTP verified and user registered' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Integrated Model Request Routes --- //

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

// Fetch all model requests for Admins
router.get('/all-requests', async (req, res) => {
  try {
    console.log('Session User:', req.session.user);
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

// Fetch model requests for the logged-in Architect
router.get('/requests', async (req, res) => {
  try {
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

// Update model request status
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

// View all model requests by the logged-in Architect
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

// --- Helper Functions --- //
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.error('Error sending email:', err);
  });
}

module.exports = router;
