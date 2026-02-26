const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      // enum: ["Hackathon", "Freshers", "Seminar", "Workshop", "Other"],
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String, // Cloudinary URL
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
