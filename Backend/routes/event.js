const express = require("express");
const router = express.Router();
const axios = require("axios");
const validations = require("./validation");
const multer = require("multer");
const eventData = require("../data/events");

const upload = multer({ dest: "images/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageName = req.file.filename;
    let event = await eventData.createEvent(
      req.body.title,
      req.body.description,
      req.body.time,
      req.body.capacity,
      req.body.address,
      req.body.address2,
      imageName
    );

    return res.json(event);
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

router.get("/:page", async (req, res) => {
  try {
    let events = await eventData.getAll(req.params.page);
    return res.json(events);
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
