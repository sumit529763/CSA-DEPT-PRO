const Event = require("../models/Event.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * 🔧 Helper: Upload buffer to Cloudinary
 */
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "events",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * ===============================
 * CREATE EVENT
 * ===============================
 */
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      date,
      time,
      venue,
      category,
      description,
    } = req.body;

    // 🔒 Validation
    if (!title || !date || !time || !venue || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let imageUrl = "";

    // 📸 Image Upload (FIXED)
    if (req.file) {
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    }

    // 💾 Save Event
    const event = await Event.create({
      title,
      date,
      time,
      venue,
      category,
      description,
      image: imageUrl,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating event",
    });
  }
};

/**
 * ===============================
 * GET ALL EVENTS
 * ===============================
 */
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get Events Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching events",
    });
  }
};

/**
 * ===============================
 * UPDATE EVENT
 * ===============================
 */
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 📸 Replace image if uploaded (FIXED)
    if (req.file) {
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      req.body.image = uploadResult.secure_url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Update Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating event",
    });
  }
};

/**
 * ===============================
 * DELETE EVENT
 * ===============================
 */
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting event",
    });
  }
};