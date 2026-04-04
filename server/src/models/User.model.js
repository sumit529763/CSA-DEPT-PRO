const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    designation:    { type: String, default: "" },
    qualification:  { type: String, default: "" }, // ✅ NEW
    specialization: { type: String, default: "" }, // ✅ NEW
    bio:            { type: String, default: "" },
    research:       { type: String, default: "" },
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:       { type: String, required: true, minlength: 6 },
    photo:          { type: String, default: "" },
    scholarUrl:     { type: String, default: "" },  // ✅ NEW
    expertise:      { type: [String], default: [] }, // ✅ NEW
    isHOD:          { type: Boolean, default: false }, // ✅ NEW
    role:           { type: String, enum: ["admin", "superadmin"], default: "admin" },
    isActive:       { type: Boolean, default: true },
    lastLogin:      { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);