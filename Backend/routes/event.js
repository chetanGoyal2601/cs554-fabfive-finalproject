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
    const user = "123";
    let event = await eventData.createEvent(
      req.body.title,
      req.body.description,
      req.body.time,
      req.body.capacity,
      req.body.address,
      req.body.address2,
      user,
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

router.get("/page/:page", async (req, res) => {
  try {
    let events = await eventData.getAll(req.params.page);
    events.userId = "23";
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

router.get("/:id", async (req, res) => {
  // try {
  //   req.params.id = validation.checkId(req.params.id, "Band ID");
  // } catch (e) {
  //   return res.status(400).json({ error: e });
  // }
  try {
    const event = await eventData.get(req.params.id);
    res.json(event);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    let event = await eventData.setRsvp(req.params.id, req.body.data.userId);
    let events = null;
    if (event.updated) {
      events = await eventData.getAll(parseInt(req.body.data.page));
      events.userId = "123";
    }
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

router.delete("/:id", async (req, res) => {
  try {
    let event = await eventData.remove(req.params.id);
    let events = null;
    if (event.deleted) {
      events = await eventData.getAll(parseInt(req.body.page));
      events.userId = "123";
    }
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
