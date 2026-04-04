const Alumni    = require("../models/Alumni.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { logAction } = require("../middleware/logger");

const uploadFromBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "alumni", quality: "auto", fetch_format: "auto" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ── CREATE ───────────────────────────────────────
exports.createAlumni = async (req, res) => {
  try {
    const { name, batch, passoutYear, position, company, location, linkedinUrl, quote, isHighlight } = req.body;

    if (!name || !batch || !passoutYear) {
      return res.status(400).json({ success: false, message: "name, batch and passoutYear are required." });
    }

    let photoUrl = "";
    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      photoUrl = result.secure_url;
    }

    const doc = await Alumni.create({
      name, batch, passoutYear,
      position: position || "",
      company:  company  || "",
      location: location || "",
      linkedinUrl: linkedinUrl || "",
      quote: quote || "",
      photo: photoUrl,
      isHighlight: isHighlight === "true" || isHighlight === true,
      createdBy: req.user?._id,
    });

    await logAction(req.user._id, "CREATE_ALUMNI", `Added alumni: ${name}`, req);
    res.status(201).json({ success: true, message: "Alumni added successfully", data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── UPDATE ───────────────────────────────────────
exports.updateAlumni = async (req, res) => {
  try {
    const doc = await Alumni.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Alumni not found" });

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      req.body.photo = result.secure_url;
    }

    if (req.body.isHighlight !== undefined) {
      req.body.isHighlight = req.body.isHighlight === "true" || req.body.isHighlight === true;
    }

    const updated = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logAction(req.user._id, "UPDATE_ALUMNI", `Updated alumni: ${updated.name}`, req);
    res.status(200).json({ success: true, message: "Updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE ───────────────────────────────────────
exports.deleteAlumni = async (req, res) => {
  try {
    const doc = await Alumni.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Alumni not found" });
    const name = doc.name;
    await doc.deleteOne();
    await logAction(req.user._id, "DELETE_ALUMNI", `Deleted alumni: ${name}`, req);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET ALL public (filter by passoutYear) ────────
exports.getAllAlumni = async (req, res) => {
  try {
    const { year } = req.query;
    const filter = year ? { passoutYear: year } : {};
    const docs = await Alumni.find(filter).sort({ isHighlight: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET distinct passout years ────────────────────
exports.getYears = async (req, res) => {
  try {
    const years = await Alumni.distinct("passoutYear");
    years.sort((a, b) => b.localeCompare(a));
    res.status(200).json({ success: true, data: years });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET ALL admin ─────────────────────────────────
exports.getAllAdmin = async (req, res) => {
  try {
    const docs = await Alumni.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};