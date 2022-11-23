const express = require("express");
const router = express.Router();
const axios = require("axios");
const validations = require("./validation");
const multer = require("multer");

const upload = multer({ dest: "images/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    let hello = { message: "Hello" };
    const imagePath = req.file.path;
    // const description = req.body.description;

    // Save this data to a database probably

    console.log(imagePath);
    return res.json(hello);
  } catch (e) {
    if (e.name == "AxiosError")
      return res.status(e.response.status || 404).json({
        errors: e.response.statusText,
      });
    else
      return res.status(e.code || 404).json({
        errors: e.message,
      });
  }
});

module.exports = router;
