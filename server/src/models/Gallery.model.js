const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Infrastructure', 'Events', 'Academic'] 
  },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Gallery", gallerySchema);