const express = require("express");
const router = express.Router();

const { verifyOTPEmail, resendOTPVerificationEmail } = require("./controller");

router.post("/verifyOTP", async (req, res) => {
  try {
    let { userId, OTP } = req.body;
    if (!userId || !OTP) throw Error("Empty otp details are not allowed");
    await verifyOTPEmail(userId, OTP);
    res.json({
      status: "VERIFIED",
      message: `User email verified successfully.`,
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
    if (!userId || !email) throw Error("Empty user details are not allowed");

    const emailData = await resendOTPVerificationEmail(userId, email);

    res.json({
      status: "PENDING",
      message: "Verification otp email sent",
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
