const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { logAction } = require("../middleware/logger");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ==========================================
// 🔐 LOGIN
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, password, captchaAnswer, num1, num2 } = req.body;

    if (!email || !password || captchaAnswer === undefined) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and captcha are required",
      });
    }

    if (parseInt(captchaAnswer) !== parseInt(num1) + parseInt(num2)) {
      return res.status(400).json({
        success: false,
        message: "Incorrect captcha answer. Please try again.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Save lastLogin
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    await logAction(user._id, "LOGIN", `Admin logged into the system`, req);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id:          user._id,
        email:       user.email,
        role:        user.role,
        name:        user.name,
        photo:       user.photo,
        designation: user.designation,
        lastLogin:   user.lastLogin,
        createdAt:   user.createdAt,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// 👤 GET ME
// ==========================================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("GET ME ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// ✏️ UPDATE PROFILE
// ==========================================
exports.updateProfile = async (req, res) => {
  try {
    const { name, designation, bio } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name)                      user.name        = name.trim();
    if (designation !== undefined) user.designation = designation.trim();
    if (bio !== undefined)         user.bio         = bio.trim();

    // ✅ Cloudinary photo upload
    if (req.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "users/profiles" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      const result = await uploadFromBuffer();
      user.photo = result.secure_url;
    }

    await user.save({ validateBeforeSave: false });

    await logAction(
      req.user._id,
      "UPDATE_PROFILE",
      `Updated own profile: ${user.name}`,
      req
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// 🔑 UPDATE PASSWORD
// ==========================================
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // ✅ Prevent reusing same password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as current password",
      });
    }

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    await logAction(
      req.user._id,
      "UPDATE_PASSWORD",
      `Password changed by: ${user.name}`,
      req
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};