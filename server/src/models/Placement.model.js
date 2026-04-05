const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    studentName:  { type: String, required: true, trim: true },
    company:      { type: String, required: true, trim: true },
    role:         { type: String, required: true, trim: true },
    package:      { type: String, required: true, trim: true }, // e.g. "12 LPA"
    batch:        { type: String, required: true, trim: true }, // e.g. "2024"
    type:         { type: String, enum: ["Internship", "Full-Time"], default: "Full-Time" },
    photo:        { type: String, default: "" },
    companyLogo:  { type: String, default: "" },
    testimonial:  { type: String, default: "" },
    isFeatured:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Placement", placementSchema);