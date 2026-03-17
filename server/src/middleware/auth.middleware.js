const jwt = require("jsonwebtoken");
const User = require("../models/User.model");


// ================= PROTECT =================
// Any logged-in user
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get full user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token failed",
    });
  }
};


// ================= ADMIN OR SUPERADMIN =================
// Used for News, Events, Notices etc
exports.adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }

  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }

  return res.status(403).json({
    message: "Admin access denied",
  });
};


// ================= ONLY SUPERADMIN =================
// Used for creating/deleting admins
exports.isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }

  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Only SuperAdmin allowed",
    });
  }

  next();
};