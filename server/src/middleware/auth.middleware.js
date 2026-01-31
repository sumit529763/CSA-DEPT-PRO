const jwt = require("jsonwebtoken");

// Verify JWT token
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Only superadmin access
exports.superAdminOnly = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Super admin access only" });
  }
  next();
};
