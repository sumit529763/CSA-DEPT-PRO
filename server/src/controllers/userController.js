const User = require("../models/User.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { logAction } = require("../middleware/logger");

// ==========================================
// 🚀 CREATE ADMIN (SuperAdmin only)
// ==========================================
exports.createUser = async (req, res) => {
  try {
    const { name, designation, bio, research, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    let photoUrl = "";
    if (req.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "users" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      const result = await uploadFromBuffer();
      photoUrl = result.secure_url;
    }

    const user = await User.create({
      name,
      designation,
      bio,
      research,
      email,
      password,
      photo: photoUrl,
      role: "admin",
      isActive: true,
    });

    await logAction(
      req.user._id,
      "CREATE_USER",
      `Created Admin Account: ${name} (${email})`,
      req
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 📄 GET ALL USERS (All admins — exclude superadmin)
// ==========================================
exports.getUsers = async (req, res) => {
  try {
    // ✅ FIX: fetch ALL non-superadmin users
    // Old users without role field or with role:"admin" both get included
    const users = await User.find({
      role: { $ne: "superadmin" },  // everyone EXCEPT superadmin
    })
      .select("-password")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ✏️ UPDATE USER
// ==========================================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, bio, research, email, password, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ FIX: prevent updating superadmin via this route
    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "SuperAdmin account cannot be modified here",
      });
    }

    // Update fields
    if (name)        user.name        = name;
    if (designation) user.designation = designation;
    if (bio)         user.bio         = bio;
    if (research)    user.research    = research;
    if (email)       user.email       = email;

    // ✅ FIX: isActive toggle support
    if (isActive !== undefined) user.isActive = isActive;

    // ✅ FIX: only hash new password if provided
    if (password && password.trim() !== "") {
      user.password = password; // pre-save hook will hash it
    }

    // ✅ FIX: Cloudinary upload for photo update
    if (req.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "users" },
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

    await user.save();

    await logAction(
      req.user._id,
      "UPDATE_USER",
      `Updated Admin Profile: ${user.name} (${user.email})`,
      req
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ❌ DELETE USER
// ==========================================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "SuperAdmin cannot be deleted",
      });
    }

    // ✅ Prevent self-delete
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const userName = user.name;
    await user.deleteOne();

    await logAction(
      req.user._id,
      "DELETE_USER",
      `Deleted Admin: ${userName} (ID: ${id})`,
      req
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 🔄 TOGGLE ACTIVE STATUS
// ==========================================
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "SuperAdmin status cannot be changed",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    await logAction(
      req.user._id,
      "TOGGLE_USER_STATUS",
      `${user.isActive ? "Activated" : "Deactivated"} Admin: ${user.name}`,
      req
    );

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      data: { isActive: user.isActive },
    });
  } catch (error) {
    console.error("TOGGLE STATUS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};