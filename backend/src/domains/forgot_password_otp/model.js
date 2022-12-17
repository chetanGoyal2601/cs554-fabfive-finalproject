const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PasswordResetOTPSchema = new Schema({
  userId: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

const PasswordResetOTP = mongoose.model(
  "PasswordResetOTP",
  PasswordResetOTPSchema
);

module.exports = PasswordResetOTP;
