const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    req.session.user = { id: user._id, firstName: user.firstName, email: user.email };
    res.json({ success: true, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// Registration endpoint
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
      password: hashedPassword,
      role,
    });

    // Generate and set OTP
    const otp = generateOtp();
    user.otp = otp;

    await user.save();

    // Send OTP
    sendOtpEmail(user.email, otp);

    // Respond with success message
    return res.status(201).json({ message: 'User registered successfully. An OTP has been sent to your email.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// OTP verification endpoint
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

// Fetch session data
router.get('/session', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '21bmiit096@gmail.com',
      pass: 'thgccrbktampmmjb',
    },
  });

  const mailOptions = {
    from: '21bmiit096@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = router;
