const Gallery = require("../models/Gallery.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

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

exports.createGalleryItem = async (req, res) => {
  try {
    const { caption, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    // ✅ FIXED HERE
    const result = await uploadFromBuffer(req.file.buffer);

    const newItem = await Gallery.create({
      caption,
      category,
      image: result.secure_url,
      uploadedBy: req.user.id
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    await item.deleteOne();

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};