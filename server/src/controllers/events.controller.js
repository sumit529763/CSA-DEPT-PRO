const Event = require("../models/Event.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { logAction } = require("../middleware/logger");

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "events", quality: "auto", fetch_format: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ================= CREATE EVENT =================
exports.createEvent = async (req, res) => {
  try {
    const { title, date, time, venue, category, description } = req.body;

    if (!title || !date || !time || !venue || !category || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    }

    const event = await Event.create({
      title, date, time, venue, category, description,
      image: imageUrl,
      createdBy: req.user._id,
    });

    // ✨ AUDIT LOG
    await logAction(req.user._id, "CREATE_EVENT", `Scheduled Event: ${title}`, req);

    return res.status(201).json({ success: true, message: "Event created successfully", data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating event" });
  }
};

// ================= UPDATE EVENT =================
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (req.file) {
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      req.body.image = uploadResult.secure_url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });

    // ✨ AUDIT LOG
    await logAction(req.user._id, "UPDATE_EVENT", `Modified Event: ${updatedEvent.title}`, req);

    return res.status(200).json({ success: true, message: "Event updated successfully", data: updatedEvent });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating event" });
  }
};

// ================= DELETE EVENT =================
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    const eventTitle = event.title;
    await event.deleteOne();

    // ✨ AUDIT LOG
    await logAction(req.user._id, "DELETE_EVENT", `Deleted Event: ${eventTitle}`, req);

    return res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting event" });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching events" });
  }
};