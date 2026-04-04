const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    studentName: {
      type: String,
      default: "",   // can be individual or team
    },

    category: {
      type: String,
      enum: ["Academic", "Research", "Sports", "Cultural", "Technical", "Award", "Other"],
      default: "Academic",
    },

    year: {
      type: String,   // e.g. "2024"
      required: true,
    },

    image: {
      type: String,   // Cloudinary URL
      default: "",
    },

    isHighlight: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);