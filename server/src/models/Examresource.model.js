const mongoose = require("mongoose");

const examResourceSchema = new mongoose.Schema(
  {
    // Which tab this entry belongs to
    category: {
      type: String,
      enum: ["Schedules", "Results", "Resources"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // For Schedules: exam date
    examDate: {
      type: Date,
      default: null,
    },

    // For Schedules: subject/paper code e.g. "CS-101"
    code: {
      type: String,
      default: "",
      trim: true,
    },

    // For Results: when the result was released
    releaseDate: {
      type: Date,
      default: null,
    },

    // For Resources: type label e.g. "PDF" or "Link"
    resourceType: {
      type: String,
      enum: ["PDF", "Link", ""],
      default: "",
    },

    // Cloudinary URL or external link
    fileUrl: {
      type: String,
      default: "",
    },

    // Cloudinary public_id (for PDF uploads, so we can delete them)
    filePublicId: {
      type: String,
      default: "",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamResource", examResourceSchema);