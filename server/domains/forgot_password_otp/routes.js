const express = require("express");
const router = express.Router();
const {
  requestOTPPasswordReset,
  resetOTPUserPassword,
  resendOTPPasswordResetEmail,
} = require("./controller");


router.post("/request", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) throw Error("Empty credentials are not allowed.");

    const emailData = await requestOTPPasswordReset(email);
    res.json({
      status: "PENDING",
      message: "Password reset otp email sent",
      data: emailData,
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

router.post("/reset", async (req, res) => {
  try {
    let { userId, otp, newPassword } = req.body;
    if (!userId || !otp || !newPassword)
      throw Error("Empty credentials are not allowed.");

    await resetOTPUserPassword(userId, otp, newPassword);

    res.json({
      status: "SUCCESS",
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});


router.post("/resend", async (req, res) => {
  try {
    let { userId, email } = req.body;
    if (!userId || !email) throw Error("Empty credentials are not allowed");

    const emailData = await resendOTPPasswordResetEmail(userId, email);

    res.json({
      status: "PENDING",
      message: "Password reset otp email sent",
      data: emailData,
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

module.exports = router;
