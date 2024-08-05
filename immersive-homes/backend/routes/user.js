const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

// Endpoint to register a user and send OTP
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    const otp = generateOtp();
    user.otp = otp; // Store OTP in user model temporarily

    await user.save();

    sendOtpEmail(user.email, otp);
    res.status(201).send('User registered and OTP sent');
  } catch (err) {
    res.status(400).send(err);
  }
});

// Endpoint to verify OTP and save user details
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && user.otp === otp) {
      user.otp = undefined; // Clear OTP after verification
      await user.save();
      res.send('OTP verified and user registered');
    } else {
      res.status(400).send('Invalid OTP');
    }
  } catch (err) {
    res.status(500).send(err);
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
      pass: 'thgccrbktampmmjb'
    }
  });

  const mailOptions = {
    from: '21bmiit096@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
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
