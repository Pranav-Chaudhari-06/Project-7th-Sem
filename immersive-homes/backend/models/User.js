const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true }, // Change age to dateOfBirth
  gender: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  iv: { type: String }, // Field to store the initialization vector (IV) for encryption
  role: { type: String, required: true },
  otp: { type: String }, // OTP field
  resetPasswordToken: { type: String }, // Field to store the reset token
  resetPasswordExpires: { type: Date }, // Field to store the expiration time of the reset token
});

module.exports = mongoose.model('User', UserSchema);
