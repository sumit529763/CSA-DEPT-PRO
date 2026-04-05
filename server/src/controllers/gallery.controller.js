const Gallery = require("../models/Gallery.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
// 1. MUST IMPORT THIS AT THE TOP
const { logAction } = require("../middleware/logger");

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "gallery" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ==========================================
// 🚀 CREATE GALLERY ITEM
// ==========================================
exports.createGalleryItem = async (req, res) => {
  try {
    const { caption, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    // Upload to Cloudinary
    const result = await uploadFromBuffer(req.file.buffer);

    const newItem = await Gallery.create({
      caption,
      category,
      image: result.secure_url,
      uploadedBy: req.user._id // Using _id from protect middleware
    });

    // ✨ LOG ACTION: Move this AFTER successful creation
    await logAction(
      req.user._id, 
      "UPLOAD_GALLERY", 
      `Uploaded new image to ${category}: ${caption}`, 
      req
    );

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error("GALLERY CREATE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 📄 GET ALL ITEMS
// ==========================================
exports.getAllGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ❌ DELETE GALLERY ITEM
// ==========================================
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    const category = item.category;
    await item.deleteOne();

    // ✨ LOG ACTION: Record the deletion
    await logAction(
      req.user._id, 
      "DELETE_GALLERY", 
      `Deleted image from ${category}`, 
      req
    );

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};