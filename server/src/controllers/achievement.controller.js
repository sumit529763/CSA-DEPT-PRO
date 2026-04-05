const Achievement = require("../models/Achievement.model");
const cloudinary   = require("../config/cloudinary");
const streamifier  = require("streamifier");
const { logAction } = require("../middleware/logger");

const uploadFromBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "achievements", quality: "auto", fetch_format: "auto" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ── CREATE ───────────────────────────────────────────
exports.createAchievement = async (req, res) => {
  try {
    const { title, description, studentName, category, year, isHighlight } = req.body;
    if (!title || !description || !year) {
      return res.status(400).json({ success: false, message: "title, description and year are required." });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const doc = await Achievement.create({
      title, description,
      studentName: studentName || "",
      category: category || "Academic",
      year,
      image: imageUrl,
      isHighlight: isHighlight === "true" || isHighlight === true,
      createdBy: req.user?._id,
    });

    await logAction(req.user._id, "CREATE_ACHIEVEMENT", `Added achievement: ${title}`, req);
    res.status(201).json({ success: true, message: "Achievement added", data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── UPDATE ───────────────────────────────────────────
exports.updateAchievement = async (req, res) => {
  try {
    const doc = await Achievement.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      req.body.image = result.secure_url;
    }
    if (req.body.isHighlight !== undefined)
      req.body.isHighlight = req.body.isHighlight === "true" || req.body.isHighlight === true;

    const updated = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logAction(req.user._id, "UPDATE_ACHIEVEMENT", `Updated: ${updated.title}`, req);
    res.status(200).json({ success: true, message: "Updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE ───────────────────────────────────────────
exports.deleteAchievement = async (req, res) => {
  try {
    const doc = await Achievement.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    const title = doc.title;
    await doc.deleteOne();
    await logAction(req.user._id, "DELETE_ACHIEVEMENT", `Deleted: ${title}`, req);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET ALL public (filter by year / category) ────────
exports.getAllAchievements = async (req, res) => {
  try {
    const { year, category } = req.query;
    const filter = {};
    if (year)     filter.year     = year;
    if (category) filter.category = category;
    const docs = await Achievement.find(filter).sort({ isHighlight: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET distinct years ────────────────────────────────
exports.getYears = async (req, res) => {
  try {
    const years = await Achievement.distinct("year");
    years.sort((a, b) => b.localeCompare(a));
    res.status(200).json({ success: true, data: years });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET ALL admin ─────────────────────────────────────
exports.getAllAdmin = async (req, res) => {
  try {
    const docs = await Achievement.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};