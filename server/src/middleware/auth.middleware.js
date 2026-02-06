const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("DECODED TOKEN 👉", decoded);
    req.user = decoded; // 🔥 REQUIRED
    next();

  } catch (error) {
    return res.status(401).json({ message: "Token failed" });
  }
};

exports.adminOnly = (req, res, next) => {
  const role = req.user?.role?.toUpperCase();
  if (role === "ADMIN" || role === "SUPERADMIN") {
    return next();
  }
  return res.status(403).json({
    message: "Admin access denied",
    yourRole: req.user.role,
  });
};


