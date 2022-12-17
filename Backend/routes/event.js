const express = require("express");
const router = express.Router();
const axios = require("axios");
const validations = require("../data/validation");
const multer = require("multer");
const eventData = require("../data/events");
const userData = require("../data/users");

const upload = multer({ dest: "images/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    //validations
    // if (!userId) throw { message: "User not logged in", code: 403 };
  } catch (e) {
    return res.status(400).json({ error: e.message ? e.message : e });
  }

  try {
    //validations
    req.body.title = validations.checkString(req.body.title, "Title");
    req.body.description = validations.checkString(
      req.body.description,
      "Description"
    );
    req.body.address = validations.checkString(req.body.address, "Address");
    req.body.address2 = validations.checkAddress2(
      req.body.address2,
      "Address 2"
    );
    req.body.time = validations.checkString(req.body.time, "Date & Time");
    req.file.filename = validations.checkString(
      req.file.filename,
      "Image Name"
    );
    req.body.capacity = validations.checkNumber(req.body.capacity, "Capacity");
  } catch (e) {
    return res.status(400).json({ error: e.message ? e.message : e });
  }

  try {
    const imageName = req.file.filename;
    const userId = "23";
    let event = await eventData.createEvent(
      req.body.title,
      req.body.description,
      req.body.time,
      req.body.capacity,
      req.body.address,
      req.body.address2,
      userId,
      imageName
    );
    // let user = await userData.setCurrentlyHosted(
    //   req.params.id,
    //   req.body.data.userId,
    //   "Add"
    // );
    return res.json(event);
  } catch (e) {
    return res.status(400).json({ error: e.message ? e.message : e });
  }
});

router.get("/user", async (req, res) => {
  try {
    let userId = { userId: "false" };
    // userData.calcAvgRating(23);
    return res.json(userId);
  } catch (e) {
    return res.status(e.code || 404).json({
      error: e.message ? e.message : e,
    });
  }
});

router.get("/page/:page", async (req, res) => {
  try {
    req.params.page = validations.checkNumber(req.params.page, "Page Number");
  } catch (e) {
    return res.status(400).json({ error: e ? e.message : e });
  }
  try {
    let events = await eventData.getAll(req.params.page);
    events.userId = "23";
    return res.json(events);
  } catch (e) {
    return res.status(e.code || 404).json({
      error: e.message ? e.message : e,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    req.params.id = validations.checkId(req.params.id, "Event ID");
  } catch (e) {
    return res.status(400).json({ error: e.message ? e.message : e });
  }
  try {
    const event = await eventData.get(req.params.id);
    event.userId = "23";
    res.json(event);
  } catch (e) {
    res.status(404).json({ error: e.message ? e.message : e });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    //validations
    // if (!userId) throw { message: "User not logged in", code: 403 };
  } catch (e) {
    return res.status(400).json({ error: e.message ? e.message : e });
  }
  try {
    req.params.id = validations.checkId(req.params.id, "Event ID");
    // req.body.data.userId = validations.checkId(req.body.data.userId, "User ID");
  } catch (e) {
    return res.status(400).json({ error: e.message ? e.message : e });
  }
  try {
    let event = await eventData.setRsvp(req.params.id, req.body.data.userId);
    // let user = await userData.setRsvp(req.params.id, req.body.data.userId);
    let events = null;
    // if (event.updated && user.updated && req.body.data.page != null)
    if (event.updated && req.body.data.page != null) {
      req.body.data.page = validations.checkNumber(
        req.body.data.page,
        "Page Number"
      );
      events = await eventData.getAll(req.body.data.page);
    }
    if (event.updated && req.body.data.page === null) events = event;
    events.userId = "23";
    return res.json(events);
  } catch (e) {
    return res.status(e.code || 404).json({
      error: e.message ? e.message : e,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    //validations
    // if (!userId) throw { message: "User not logged in", code: 403 };
  } catch (e) {
    return res.status(400).json({ error: e.message ? e.message : e });
  }
  try {
    req.params.id = validations.checkId(req.params.id, "Event ID");
    // req.body.userId = validations.checkId(req.body.userId, "User ID");
  } catch (e) {
    return res.status(400).json({ error: e.message ? e.message : e });
  }
  try {
    let event = await eventData.remove(req.params.id, req.body.userId);
    // let user = await userData.setCurrentlyHosted(
    //   req.params.id,
    //   req.body.data.userId,
    //   "Delete"
    // );
    let events = null;
    if (event.deleted && req.body.page != null) {
      req.body.page = validations.checkNumber(req.body.page, "Page Number");
      events = await eventData.getAll(req.body.page);
    }
    if (event.deleted && req.body.page === null) events = event;
    events.userId = "23";
    return res.json(events);
  } catch (e) {
    return res.status(e.code || 404).json({
      error: e.message ? e.message : e,
    });
  }
});

router.post("/rating/:id", async (req, res) => {
  try {
    //validations
    // if (!userId) throw { message: "User not logged in", code: 403 };
  } catch (e) {
    return res.status(400).json({ error: e.message ? e.message : e });
  }
  try {
    req.params.id = validations.checkId(req.params.id, "Event ID");
    // req.body.data.userId = validations.checkId(req.body.data.userId, "User ID"); // Need to verify body.data or body
    req.body.data.rating = validations.checkFloat(
      req.body.data.rating,
      "Rating"
    );
  } catch (e) {
    return res.status(400).json({ error: e ? e.message : e });
  }
  try {
    let events = await eventData.setRating(
      req.params.id,
      req.body.data.rating,
      req.body.data.userId
    );
    events.userId = "23";
    // userData.calcAvgRating(23);
    return res.json(events);
  } catch (e) {
    return res.status(e.code || 404).json({
      error: e.message ? e.message : e,
    });
  }
});

module.exports = router;
