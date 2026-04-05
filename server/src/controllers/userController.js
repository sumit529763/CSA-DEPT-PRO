const User = require("../models/User.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { logAction } = require("../middleware/logger");

// ==========================================
// 🌐 PUBLIC: GET FACULTY (for Faculty page)
// ==========================================
exports.getFacultyPublic = async (req, res) => {
  try {
    const faculty = await User.find({ isActive: true })
      .select("-password -lastLogin -createdAt -updatedAt -role")
      .sort({ isHOD: -1, createdAt: 1 }); // HOD first, then by join date

    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 🌐 PUBLIC: GET SINGLE FACULTY BY ID
// ==========================================
exports.getFacultyById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id)
      .select("-password -lastLogin -role");

    if (!member || !member.isActive) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(404).json({ success: false, message: "Faculty not found" });
  }
};

// ==========================================
// 🚀 CREATE ADMIN (SuperAdmin only)
// ==========================================
exports.createUser = async (req, res) => {
  try {
    const {
      name, designation, qualification, specialization,
      bio, research, email, password,
      scholarUrl, expertise, isHOD,
    } = req.body;

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
      name, designation, qualification, specialization,
      bio, research, email, password,
      scholarUrl: scholarUrl || "",
      expertise:  expertise  ? JSON.parse(expertise) : [],
      isHOD:      isHOD === "true" || isHOD === true,
      photo:      photoUrl,
      role:       "admin",
      isActive:   true,
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
// 📄 GET ALL USERS (Admin panel)
// ==========================================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "superadmin" } })
      .select("-password")
      .sort({ createdAt: -1 });

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
    const {
      name, designation, qualification, specialization,
      bio, research, email, password,
      scholarUrl, expertise, isHOD, isActive,
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "SuperAdmin account cannot be modified here",
      });
    }

    if (name)                        user.name           = name;
    if (designation)                 user.designation    = designation;
    if (qualification  !== undefined) user.qualification  = qualification;
    if (specialization !== undefined) user.specialization = specialization;
    if (bio            !== undefined) user.bio            = bio;
    if (research       !== undefined) user.research       = research;
    if (email)                       user.email          = email;
    if (scholarUrl     !== undefined) user.scholarUrl     = scholarUrl;
    if (isActive       !== undefined) user.isActive       = isActive;
    if (isHOD          !== undefined) user.isHOD          = isHOD === "true" || isHOD === true;

    // Parse expertise array
    if (expertise !== undefined) {
      user.expertise = typeof expertise === "string"
        ? JSON.parse(expertise)
        : expertise;
    }

    if (password && password.trim() !== "") {
      user.password = password;
    }

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

    res.status(200).json({ success: true, message: "User deleted successfully" });
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