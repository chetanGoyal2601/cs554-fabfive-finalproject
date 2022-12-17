const express = require("express");
const router = express.Router();
const { requestPasswordReset, resetUserPassword } = require("./controller");


router.post("/request", async (req, res) => {
  try {
    const { email, redirectUrl } = req.body;

    if (!email || !redirectUrl)
      throw Error("Empty credentials are not allowed.");

    await requestPasswordReset(email, redirectUrl);
    res.json({
      status: "PENDING",
      message: "Password reset email sent",
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
    let { userId, resetString, newPassword } = req.body;
    if (!userId || !resetString || !newPassword)
      throw Error("Empty credentials are not allowed.");

    await resetUserPassword(userId, resetString, newPassword);

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

module.exports = router;
