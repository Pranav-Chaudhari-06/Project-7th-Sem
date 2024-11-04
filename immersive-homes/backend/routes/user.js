const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// Encryption and Decryption functions
const algorithm = 'aes-256-cbc';
const encryptionKey = crypto.randomBytes(32); // Store this key securely, such as in an environment variable
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex')
  };
}


function decrypt(encryptedText, iv) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}







// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Decrypt the stored password
    const decryptedPassword = decrypt(user.password, user.iv);

    if (password !== decryptedPassword) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Set session data
    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      email: user.email,
      password: decryptedPassword, // Store decrypted password in session
      role: user.role
    };

    res.json({ success: true, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate a reset token and its expiration time
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour from now

    // Update the user with the reset token and its expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();  

    // Send the reset link via email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    sendResetEmail(user.email, resetUrl);

    res.json({ message: 'Password reset link has been sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to handle password reset
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: 'New password is required' });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user with the new password and clear the reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


function sendResetEmail(email, resetUrl) {
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
    subject: 'Password Reset',
    text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}





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

    // Encrypt the password
    const { encryptedData, iv } = encrypt(password);

    const user = new User({
      firstName,
      lastName,
      dateOfBirth: new Date(age), // Convert the date string to a Date object
      gender,
      phoneNumber,
      email,
      password: encryptedData, // Store the encrypted password
      iv: iv,  // Store the initialization vector (iv)
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




//Update user details
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

    // Encrypt the password if it's provided
    if (password) {
      const { encryptedData, iv } = encrypt(password);
      user.password = encryptedData;
      user.iv = iv;
    }

    const updatedUser = await user.save();

    // Update session data after saving
    req.session.user = {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role
    };

    res.json({ success: true, user: updatedUser });
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
