const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    type: {
      type: String,
      enum: ["Exam", "General", "Holiday", "Academic"],
      required: true,
      default: "General",
    },

    isUrgent: {
      type: Boolean,
      default: false,
    },

    // Cloudinary URL for the PDF/file attachment
    fileUrl: {
      type: String,
      default: "",
    },

    // Cloudinary public_id for deletion later
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

module.exports = mongoose.model("Notice", noticeSchema);