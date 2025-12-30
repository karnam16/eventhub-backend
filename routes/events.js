const express = require("express");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// CREATE EVENT
// CREATE EVENT WITH IMAGE
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, date, location, capacity } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const event = new Event({
        title,
        description,
        date,
        location,
        capacity,
        imageUrl: req.file.path, // Cloudinary URL
        createdBy: req.userId,
        attendees: [],
      });

      await event.save();

      res.status(201).json({ message: "Event created", event });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);



// GET ALL EVENTS
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// RSVP JOIN EVENT
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        attendees: { $ne: userId }, // user not already joined
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] }, // capacity check
      },
      {
        $addToSet: { attendees: userId }, // add user safely
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        message: "Event full or already joined",
      });
    }

    res.json({
      message: "Successfully joined event",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// RSVP LEAVE EVENT
router.post("/:id/leave", authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        $pull: { attendees: userId }, // remove user
      },
      { new: true }
    );

    res.json({
      message: "Successfully left event",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// EDIT EVENT (creator only)
// UPDATE EVENT (CREATOR ONLY)
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Only creator can edit
      if (event.createdBy.toString() !== req.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { title, description, date, location, capacity } = req.body;

      event.title = title;
      event.description = description;
      event.date = date;
      event.location = location;
      event.capacity = capacity;

      // If new image uploaded → replace
      if (req.file) {
        event.imageUrl = req.file.path;
      }

      await event.save();

      res.json({ message: "Event updated successfully", event });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE EVENT (creator only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ownership check
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
