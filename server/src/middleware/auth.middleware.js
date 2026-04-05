const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// ================= PROTECT =================
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token failed" });
  }
};

// ================= ADMIN OR SUPERADMIN =================
exports.adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access denied" });
};

// ================= ONLY SUPERADMIN =================
exports.isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Only SuperAdmin allowed" });
  }
  next();
};

// ================= ✅ NEW: SUPERADMIN DELETE ONLY =================
// Use this on DELETE routes for News, Events, Gallery, Notices, Exam
exports.superAdminDelete = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      success: false,
      message: "Only SuperAdmin can delete content",
    });
  }
  next();
};