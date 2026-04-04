const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    batch: {
      type: String, // e.g. "2018-2021" or "2021"
      required: true,
    },

    passoutYear: {
      type: String, // e.g. "2021" — used for year-tab filtering
      required: true,
    },

    position: {
      type: String, // e.g. "Software Engineer"
      default: "",
    },

    company: {
      type: String, // e.g. "Google"
      default: "",
    },

    location: {
      type: String, // e.g. "Bangalore, India"
      default: "",
    },

    linkedinUrl: {
      type: String,
      default: "",
    },

    photo: {
      type: String, // Cloudinary URL
      default: "",
    },

    quote: {
      type: String,
      default: "",
    },

    isHighlight: {
      type: Boolean, // Pin to top
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alumni", alumniSchema);